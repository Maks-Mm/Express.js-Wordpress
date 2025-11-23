// frontend/src/components/StickyTable.tsx
import { useEffect, useState, useRef } from "react";
import styles from "./ScrollStyles.module.css";

export default function StickyTable() {
  const headingRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [fixed, setFixed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const docTop = window.scrollY + 50;
      const anchorTop = anchorRef.current?.offsetTop || 0;

      setFixed(docTop > anchorTop);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="sticky_table" className={styles.sticky_table}>
      <div ref={anchorRef} className={styles.anchor}></div>

      <div
        ref={headingRef}
        className={`${styles.heading} ${fixed ? styles.fixed : ""}`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i}></div>
        ))}
      </div>

      <div className={styles.ins_content}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i}></div>
        ))}
      </div>
    </section>
  );
}
