// frontend/src/components/ScrollToTopButton.tsx
import { useEffect, useState } from "react";
import styles from "./ScrollToTopButton.module.css";

export default function ScrollToTopButton() {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowButton(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!showButton) return null;

    return (
        <button 
            className={styles.button} 
            id="scrollToTop"
            onClick={scrollToTop}
            aria-label="Scroll to top"
        >
            ↑
        </button>
    );
}