import React from 'react';

const HowItWorks = () => (
  <section className="how-it-works">
    <h2 className="section-title">How It Works?</h2>
    <div className="steps-container">
      <div className="step-card">
        <div className="step-number">1</div>
        <h3 className="step-title">Set Up Your Wallet</h3>
        <ul className="step-list">
          <li>Connect MetaMask or Trust Wallet</li>
          <li>Fund with ETH or other crypto</li>
          <li>Verify your identity</li>
        </ul>
      </div>
      <div className="step-card">
        <div className="step-number">2</div>
        <h3 className="step-title">Create Your Collection</h3>
        <ul className="step-list">
          <li>Add social links</li>
          <li>Write a description</li>
          <li>Name your collection</li>
        </ul>
      </div>
      <div className="step-card">
        <div className="step-number">3</div>
        <h3 className="step-title">Upload Your Work</h3>
        <ul className="step-list">
          <li>Images, videos, or audio</li>
          <li>3D models or VR content</li>
          <li>Set properties and royalties</li>
        </ul>
      </div>
      <div className="step-card">
        <div className="step-number">4</div>
        <h3 className="step-title">List for Sale</h3>
        <ul className="step-list">
          <li>Choose auction or fixed price</li>
          <li>Set duration and minimum bid</li>
          <li>Add unlockable content</li>
        </ul>
      </div>
    </div>
  </section>
);

export default HowItWorks;