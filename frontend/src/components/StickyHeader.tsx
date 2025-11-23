// frontend/src/components/StickyHeader.tsx
import { useEffect, useState } from "react";
import styles from "./ScrollStyles.module.css";

export default function StickyHeader() {
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 1);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTable = () => {
    const element = document.getElementById("sticky_table");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className={`${styles.header} ${sticky ? styles.sticky : ""}`}>
      <div className={styles.logo}>Logo SITE</div>
      <ul>
        <li className={styles.button_a} onClick={scrollToTable}>Go to Table</li>
        <li>box-1</li>
        <li>box-2</li>
        <li>box-3</li>
      </ul>
    </header>
  );
}
