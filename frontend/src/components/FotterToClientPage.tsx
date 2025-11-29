// frontend/src/components/FotterToClientPage.tsx

import React from 'react';
import '../components/FotterToClientPage.module.css';

function FotterToClientPage() {
  return (
    <footer className="footer-container">
      <div className="footer-content">

        {/* Left Section */}
        <div className="footer-section">
          <h3>Dortmund News Hub</h3>
          <p>Your source for WordPress & MongoDB live updates.</p>
        </div>

        {/* Middle Section */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/posts">Posts</a></li>
            <li><a href="/news">Live News</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#">🐦 Twitter</a>
            <a href="#">📸 Instagram</a>
            <a href="#">💼 LinkedIn</a>
            <a href="#">🧠 GitHub</a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Dortmund News Hub — All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default FotterToClientPage;
