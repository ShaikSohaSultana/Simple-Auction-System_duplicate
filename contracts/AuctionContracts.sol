// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
// Factory contract to deploy multiple auctions
contract AuctionFactory {
    Auction[] public auctions;

    // Event for auction creation
    event AuctionCreated(address auctionAddress, string itemName, address creator);

    // Create a new Auction instance
    function createAuction(string memory _itemName, uint _startingPrice, uint _durationInMinutes) public {
        Auction newAuction = new Auction(msg.sender, _itemName, _startingPrice, _durationInMinutes);
        auctions.push(newAuction);
        emit AuctionCreated(address(newAuction), _itemName, msg.sender);
    }

    // Return all auction instances
    function getAllAuctions() public view returns (Auction[] memory) {
        return auctions;
    }
}

// Main auction contract
contract Auction is ReentrancyGuard {
    address public auctionCreator;
    string public itemName;
    uint public startPrice;
    uint public endTime;
    bool public ended;

    address public highestBidder;
    uint public highestBid;

    // Events to track actions
    event NewHighestBid(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);
    event RefundIssued(address to, uint amount);

    // Constructor to initialize auction details
    constructor(address _creator, string memory _itemName, uint _startPrice, uint _durationInMinutes) {
        auctionCreator = _creator;
        itemName = _itemName;
        startPrice = _startPrice;
        endTime = block.timestamp + (_durationInMinutes * 1 minutes);
    }

    // Modifier to restrict actions before auction ends
    modifier onlyBeforeEnd() {
        require(block.timestamp < endTime, "Auction already ended.");
        _;
    }

    // Modifier to restrict actions after auction ends
    modifier onlyAfterEnd() {
        require(block.timestamp >= endTime, "Auction not yet ended.");
        _;
    }

    // Place a new bid
    function placeBid() public payable onlyBeforeEnd nonReentrant {
        require(msg.value > highestBid, "There already is a higher or equal bid.");

        // Refund the previous highest bidder
        if (highestBidder != address(0)) {
            payable(highestBidder).transfer(highestBid);
            emit RefundIssued(highestBidder, highestBid); // Log refund
        }

        // Update highest bidder and bid amount
        highestBidder = msg.sender;
        highestBid = msg.value;

        emit NewHighestBid(msg.sender, msg.value); // Log new bid
    }

    // Check if the auction has ended
    function isAuctionEnded() public view returns (bool) {
        return block.timestamp >= endTime;
    }

    // End the auction and transfer the highest bid to the creator
    function endAuction() public onlyAfterEnd nonReentrant {
        require(!ended, "Auction already ended.");
        require(msg.sender == auctionCreator, "Only the creator can end the auction.");
        ended = true;

        // Transfer highest bid to auction creator
        payable(auctionCreator).transfer(highestBid);
        emit AuctionEnded(highestBidder, highestBid); // Log auction result
    }
}
