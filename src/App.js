import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AuctionList from './components/AuctionList';
import Hero from './components/Hero';
import CreateAuctionModal from './components/CreateAuctionModal';
import HowItWorks from './components/HowItWorks';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import { getAuctionsFromLocal, saveAuctionsToLocal } from './utils/storage';
import Web3 from 'web3';
import auctionFactoryABI from './contracts/AuctionFactory.json';
import auctionABI from './contracts/Auction.json';
import './styles/app.css';

function App() {
  const [auctions, setAuctions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [web3, setWeb3] = useState(null);
  const factoryAddress = '0xfb70fa712781426f0314AA16B424895c652b74a6'; // Use the correct address from your last deployment  
  const [factoryContract, setFactoryContract] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3Instance.eth.getAccounts();
          setWalletAddress(accounts[0]);
          setWalletConnected(true);
          const factory = new web3Instance.eth.Contract(auctionFactoryABI.abi, factoryAddress);
          setFactoryContract(factory);
          console.log("Factory initialized:", factory);
          console.log("Calling getAllAuctions...");
          let auctionAddresses = [];
          try {
            auctionAddresses = await factory.methods.getAllAuctions().call();
            console.log("Raw auction addresses:", auctionAddresses);
          } catch (err) {
            console.error("Failed to fetch auctions:", err.message);
            auctionAddresses = [];
          }
          for (const address of auctionAddresses) {
            await addAuctionFromEvent(address);
          }
          const pastEvents = await factory.getPastEvents('AuctionCreated', { fromBlock: 0, toBlock: 'latest' });
          console.log("Past AuctionCreated events:", pastEvents);
          for (const event of pastEvents) {
            const auctionAddress = event.returnValues.auctionAddress;
            await addAuctionFromEvent(auctionAddress);
          }
          web3Instance.eth.subscribe('logs', {
            address: factoryAddress,
            topics: [web3Instance.utils.sha3('AuctionCreated(address,string,address)')]
          }, (error, result) => {
            if (error) {
              console.error("Log subscription error:", error);
              return;
            }
            console.log("Log event:", result);
            const eventAbi = auctionFactoryABI.abi.find(e => e.name === 'AuctionCreated');
            const decodedEvent = web3Instance.eth.abi.decodeLog(
              eventAbi.inputs,
              result.data,
              result.topics.slice(1)
            );
            const auctionAddress = decodedEvent.auctionAddress;
            addAuctionFromEvent(auctionAddress);
          });
        } catch (error) {
          console.error("Connection failed:", error.message, error.stack);
        }
      }
    };
    initWeb3();
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const updatedAuctions = auctions.map((auction) => {
        if (auction.endTime) {
          const newTimeLeft = Math.max(0, auction.endTime - now);
          return { ...auction, timeLeft: newTimeLeft };
        }
        return auction;
      });
      if (JSON.stringify(updatedAuctions) !== JSON.stringify(auctions)) {
        setAuctions(updatedAuctions);
        saveAuctionsToLocal(updatedAuctions);
      }
    }, 1000);
    const storedAuctions = getAuctionsFromLocal();
    if (storedAuctions.length > 0) setAuctions(storedAuctions);
    return () => clearInterval(interval);
  }, []);
  
  const addAuctionFromEvent = async (auctionAddress) => {
    if (!web3 || !factoryContract) return;
    try {
      console.log("Adding auction for address:", auctionAddress);
      const auctionContract = new web3.eth.Contract(auctionABI.abi, auctionAddress);
      const itemName = await auctionContract.methods.itemName().call();
      const startPrice = await auctionContract.methods.startPrice().call();
      const endTime = await auctionContract.methods.endTime().call();
      const highestBid = await auctionContract.methods.highestBid().call();
      const highestBidder = await auctionContract.methods.highestBidder().call();
      const creator = await auctionContract.methods.auctionCreator().call();
      console.log("Auction data fetched:", { itemName, startPrice, endTime, highestBid, highestBidder, creator });
      const newAuction = {
        id: auctionAddress,
        title: itemName || "Dynamic Name",
        image: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`,
        currentBid: web3.utils.fromWei(highestBid || startPrice, 'ether') + ' ETH',
        bids: highestBidder !== '0x0000000000000000000000000000000000000000' ? 1 : 0,
        timeLeft: Math.max(0, endTime - Math.floor(Date.now() / 1000)),
        endTime: parseInt(endTime),
        category: 'art',
        creator: creator,
        avatar: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`,
      };
      setAuctions((prev) => {
        const updated = [...prev.filter(a => a.id !== auctionAddress), newAuction];
        console.log("Updated auctions state:", updated);
        saveAuctionsToLocal(updated);
        return updated;
      });
    } catch (error) {
      console.error("Failed to add auction from event:", error);
    }
  };

  const addAuction = async (auctionData) => {
    if (!walletConnected || !factoryContract) {
      alert("Please connect your wallet and ensure contract is loaded.");
      return;
    }
    try {
      const { name, startingBid, timeInput } = auctionData;
      const timeLeft = parseTime(timeInput);
      if (!timeLeft || timeLeft <= 0) {
        alert("Please enter a valid duration (e.g., '1h 30m' or '120s').");
        return;
      }
      const durationMinutes = Math.ceil(timeLeft / 60);
      console.log("Creating auction with:", {
        name,
        startingBid,
        timeInput,
        durationMinutes,
        walletAddress,
        factoryAddress
      });
      const gasPrice = await web3.eth.getGasPrice();
      console.log("Gas Price:", web3.utils.fromWei(gasPrice, 'gwei'), "Gwei");
      const tx = await factoryContract.methods.createAuction(name, web3.utils.toWei(startingBid, 'ether'), durationMinutes)
        .send({ from: walletAddress, gas: 700000, gasPrice: gasPrice });
      console.log("Transaction successful:", tx);
      setShowModal(false);
    } catch (error) {
      console.error("Auction creation failed:", {
        message: error.message,
        code: error.code,
        data: error.data,
        stack: error.stack,
        reason: error.reason,
        transactionHash: error.transactionHash
      });
      alert("Failed to create auction. Check console for details.");
    }
  };
  const parseTime = (input) => {
    if (!input) return 0;
    let totalSeconds = 0;
    const parts = input.toLowerCase().match(/(\d+(?:[.,]\d+)?)[hms]/g) || [];
    parts.forEach(part => {
      const value = parseFloat(part);
      if (part.includes('h')) totalSeconds += value * 3600;
      if (part.includes('m')) totalSeconds += value * 60;
      if (part.includes('s')) totalSeconds += value;
    });
    return Math.max(0, totalSeconds);
  };

  const handleBidUpdate = async (auctionId, bidAmount) => {
    if (!walletConnected) {
      alert("Please connect your wallet to place a bid.");
      return;
    }
    try {
      const auctionContract = new web3.eth.Contract(auctionABI.abi, auctionId);
      const currentHighestBid = await auctionContract.methods.highestBid().call();
      const bidValue = web3.utils.toWei(bidAmount, 'ether');
      if (parseFloat(bidValue) <= parseFloat(currentHighestBid)) {
        alert("Your bid must be higher than the current highest bid.");
        return;
      }
      await auctionContract.methods.placeBid()
        .send({ from: walletAddress, value: bidValue });
      await addAuctionFromEvent(auctionId);
    } catch (error) {
      console.error("Bid placement failed:", error);
      alert("Failed to place bid. Check console for details.");
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install it to connect your wallet.");
      return;
    }
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
        alert(`Successfully connected wallet: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`);
      } else {
        alert("No accounts found. Please unlock MetaMask.");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      if (error.code === 4001) {
        alert("Wallet connection was rejected by the user.");
      } else {
        alert("Failed to connect wallet. Check MetaMask and try again.");
      }
    }
  };

  return (
    <>
      <Header onCreateClick={() => setShowModal(true)} onWalletConnect={connectWallet} walletConnected={walletConnected} />
      <Hero />
      <AuctionList auctions={auctions} onBid={handleBidUpdate} web3={web3} />
      {showModal && (
        <CreateAuctionModal
          onClose={() => setShowModal(false)}
          onCreate={addAuction}
          web3={web3}
          walletAddress={walletAddress}
        />
      )}
      <HowItWorks />
      <Newsletter />
      <Footer />
    </>
  );
}

export default App;