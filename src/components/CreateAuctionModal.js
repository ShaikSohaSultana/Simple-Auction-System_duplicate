import React, { useState } from 'react';

const CreateAuctionModal = ({ onClose, onCreate, web3, walletAddress }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [startingBid, setStartingBid] = useState('');
  const [timeInput, setTimeInput] = useState(''); // Single input for time (e.g., "1h 30m 45s")

  // Function to parse time input (e.g., "1h 30m 45s" or "2h")
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
    return Math.max(0, totalSeconds); // Ensure non-negative
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!web3 || !walletAddress) {
      alert("Please connect your wallet.");
      return;
    }
    if (!name || !image || !startingBid || !timeInput) {
      alert("All fields are required, including time.");
      return;
    }
    const timeLeft = parseTime(timeInput);
    if (timeLeft <= 0) {
      alert("Please enter a valid duration (e.g., '1h 30m' or '120s').");
      return;
    }
    const imageUrl = URL.createObjectURL(image); // Temporary; replace with IPFS in production
    const auctionData = { name, startingBid, image: imageUrl, timeInput }; // Pass timeInput for reference
    await onCreate(auctionData);
    onClose();
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-modal" onClick={onClose}>×</span>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--primary)' }}>
          Create New Auction
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <input
            type="text"
            placeholder="Item Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
          />
          <div>
            <label htmlFor="image-upload" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--gray)' }}>Upload Item Image</label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', width: '100%' }}
            />
          </div>
          <input
            type="number"
            placeholder="Starting Bid (ETH)"
            value={startingBid}
            onChange={(e) => setStartingBid(e.target.value)}
            step="0.01"
            min="0"
            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
          />
          <div>
            <label htmlFor="time-input" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--gray)' }}>Duration (e.g., 1h 30m 45s)</label>
            <input
              id="time-input"
              type="text"
              placeholder="e.g., 1h 30m or 120s"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', width: '100%' }}
            />
          </div>
          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '50px',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(78, 68, 206, 0.3)',
              width: '100%',
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(78, 68, 206, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'none';
              e.target.style.boxShadow = '0 4px 15px rgba(78, 68, 206, 0.3)';
            }}
          >
            Create Auction <i className="fas fa-check" style={{ marginLeft: '0.5rem' }}></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAuctionModal;