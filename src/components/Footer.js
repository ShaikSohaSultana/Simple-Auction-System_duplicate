import React from 'react';

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-col">
        <div className="footer-logo">BidHub</div>
        <p className="footer-about">The premier decentralized auction platform for digital collectibles and unique items.</p>
        <div className="social-links">
          <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
          <a href="#" className="social-link"><i className="fab fa-discord"></i></a>
          <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
          <a href="#" className="social-link"><i className="fab fa-telegram"></i></a>
        </div>
      </div>
      <div className="footer-col">
        <ul className="footer-links">
          <h3>Marketplace</h3>
          <li><a href="#">All NFTs</a></li>
          <li><a href="#">Art</a></li>
          <li><a href="#">Collectibles</a></li>
          <li><a href="#">Photography</a></li>
          <li><a href="#">Virtual Worlds</a></li>
        </ul>
      </div>
      <div className="footer-col">
        <ul className="footer-links">
          <h3>My Account</h3>
          <li><a href="#">Profile</a></li>
          <li><a href="#">Favorites</a></li>
          <li><a href="#">Watchlist</a></li>
          <li><a href="#">My Collections</a></li>
          <li><a href="#">Settings</a></li>
        </ul>
      </div>
      <div className="footer-col">
        <ul className="footer-links">
          <h3>Resources</h3>
          <li><a href="#">Help Center</a></li>
          <li><a href="#">Platform Status</a></li>
          <li><a href="#">Partners</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Newsletter</a></li>
        </ul>
      </div>
    </div>
    <div className="copyright">© 2025 BidHub. All rights reserved. <i className="fas fa-heart" style={{ color: 'var(--secondary)' }}></i></div>
  </footer>
);

export default Footer;