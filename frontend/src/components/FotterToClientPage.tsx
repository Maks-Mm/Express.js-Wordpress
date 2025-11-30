// frontend/src/components/FotterToClientPage.tsx
import React from "react";
import styles from "../components/FotterToClientPage.module.css";

function FotterToClientPage() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>

        {/* Left Section */}
        <div className={styles.column}>
          <h3 className={styles.title}>Dortmund News Hub</h3>
          <p className={styles.description}>
            WordPress + MongoDB — Live Tech & BVB updates every hour.
          </p>
        </div>

        {/* Center Section */}
        <div className={styles.column}>
          <h4 className={styles.subtitle}>Quick Links</h4>
          <ul className={styles.links}>
            <li><a href="/">🏠 Home</a></li>
            <li><a href="/posts">📚 Posts</a></li>
            <li><a href="/news">⚡ Live News</a></li>
            <li><a href="/contact">📩 Contact</a></li>
          </ul>
        </div>

        {/* Right Section */}
        <div className={styles.column}>
          <h4 className={styles.subtitle}>Follow Us</h4>
          <div className={styles.social}>
            <a href="#" target="_blank">🐦 Twitter</a>
            <a href="#" target="_blank">📸 Instagram</a>
            <a href="#" target="_blank">💼 LinkedIn</a>
            <a href="#" target="_blank">🧠 GitHub</a>
          </div>
        </div>

      </div>

      <div className={styles.bottom}>
        <p>© {currentYear} Dortmund News Hub — All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default FotterToClientPage;
