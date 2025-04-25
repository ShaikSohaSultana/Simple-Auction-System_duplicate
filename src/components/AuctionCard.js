import React, { useState } from 'react';

const AuctionCard = ({ auction, onBid, web3 }) => {
  const [showModal, setShowModal] = useState(false);
  const [bidAmount, setBidAmount] = useState('');

  const handleBid = async () => {
    if (!web3 || !auction.timeLeft) {
      alert('Auction has ended or wallet not connected');
      return;
    }
    await onBid(auction.id, bidAmount);
    setShowModal(false);
  };

  const getCategoryColor = (category) => {
    const colors = { art: 'var(--art)', collectibles: 'var(--collectibles)', photography: 'var(--photography)', sports: 'var(--sports)', 'virtual-worlds': 'var(--virtual-worlds)' };
    return colors[category] || 'var(--primary)';
  };
  const getCategoryName = (category) => {
    const names = { art: 'Art', collectibles: 'Collectibles', photography: 'Photography', sports: 'Sports', 'virtual-worlds': 'Virtual Worlds' };
    return names[category] || '';
  };

  // Break down timeLeft into hours, minutes, and seconds
  const hours = Math.floor(auction.timeLeft / 3600);
  const minutes = Math.floor((auction.timeLeft % 3600) / 60);
  const seconds = auction.timeLeft % 60;
  const timeLeftText = `${hours} hr ${minutes.toString().padStart(2, '0')} min ${seconds.toString().padStart(2, '0')} sec left`;

  return (
    <>
      <div className="auction-card" onClick={() => setShowModal(true)}>
        <img src={auction.image} alt={auction.title} className="auction-image" />
        <div className="auction-details">
          <span className="auction-category" style={{ background: getCategoryColor(auction.category), color: 'white' }}>
            {getCategoryName(auction.category)}
          </span>
          <span className="auction-time">{timeLeftText}</span>
          <h3 className="auction-title">{auction.title}</h3>
          <div className="auction-creator">
            <img src={auction.avatar} alt={auction.creator} className="creator-avatar" />
            <span>{auction.creator}</span>
          </div>
          <div className="auction-stats">
            <div className="stat">
              <i className="fas fa-gavel"></i>
              <div><div className="stat-value">{auction.currentBid}</div><div className="stat-label">Current Bid</div></div>
            </div>
            <div className="stat">
              <i className="fas fa-history"></i>
              <div><div className="stat-value">{auction.bids}</div><div className="stat-label">Bids</div></div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal" onClick={(e) => e.target.className === 'modal' && setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={() => setShowModal(false)}>×</span>
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
              <img src={auction.image} alt={auction.title} style={{ width: '60%', maxHeight: '400px', objectFit: 'cover', borderRadius: '12px' }} />
              <div>
                <span style={{ background: getCategoryColor(auction.category), color: 'white', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '1rem' }}>
                  {getCategoryName(auction.category)}
                </span>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{auction.title}</h2>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <img src={auction.avatar} alt={auction.creator} style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} />
                  <div><div style={{ fontWeight: 500 }}>Creator</div><div style={{ color: 'var(--primary)', fontWeight: 600 }}>{auction.creator}</div></div>
                </div>
                <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--gray)' }}>Current Bid</span><span style={{ fontWeight: 600 }}>{auction.currentBid}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--gray)' }}>Total Bids</span><span style={{ fontWeight: 600 }}>{auction.bids}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary)', fontWeight: 600, marginBottom: '1.5rem' }}>
                  <i className="fas fa-clock" style={{ marginRight: '8px' }}></i>
                  <span>{hours} hr {minutes.toString().padStart(2, '0')} min {seconds.toString().padStart(2, '0')} sec left</span>
                </div>
                <div style={{ marginTop: '2rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Place Your Bid</h3>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                      type="number"
                      placeholder="Enter your bid (ETH)"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      step="0.01"
                      min="0"
                      style={{ flex: 1, padding: '12px 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
                    />
                    <button
                      className="place-bid-btn"
                      onClick={handleBid}
                      style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white', border: 'none', padding: '0 2rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      <i className="fas fa-gavel"></i> Place Bid
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Description</h3>
              <p style={{ color: 'var(--gray)', lineHeight: 1.7 }}>This is a rare {getCategoryName(auction.category).toLowerCase()} NFT created by {auction.creator}.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AuctionCard;