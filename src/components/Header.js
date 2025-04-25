import React from 'react';

const Header = ({ onCreateClick, onWalletConnect, walletConnected }) => (
  <header className="header">
    <div className="nav-container">
      <div className="logo">BidHub <i className="fas fa-gavel logo-icon"></i></div>
      <button className="connect-btn" onClick={onWalletConnect}>
        <i className={`fas ${walletConnected ? 'fa-check' : 'fa-wallet'}`}></i> {walletConnected ? 'Connected' : 'Connect Wallet'}
      </button>
      <button className="connect-btn" onClick={onCreateClick} style={{ marginLeft: '1rem' }}>
        <i className="fas fa-plus"></i> Create Auction
      </button>
    </div>
  </header>
);

export default Header;