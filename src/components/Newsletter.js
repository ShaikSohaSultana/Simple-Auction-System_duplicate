import React from 'react';

const Newsletter = () => (
  <section className="newsletter">
    <h2 className="newsletter-title">Subscribe to Our Newsletter</h2>
    <form className="newsletter-form">
      <input type="email" placeholder="Your email address" className="newsletter-input" required />
      <button type="submit" className="newsletter-btn">Subscribe</button>
    </form>
  </section>
);

export default Newsletter;