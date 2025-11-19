// frontend/src/components/NewsTable.tsx

import { useEffect, useState } from "react";
import styles from "./NewsTable.module.css";

interface NewsItem {
  id: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  source?: string;
  date: string;
  link?: string;
}

export default function NewsTable() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/mongo/news");
      const data = await res.json();
      setNews(data);
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "");

  if (loading) return <div className={styles.loading}>Loading latest news...</div>;

  if (news.length === 0) return <div className={styles.empty}>No news articles found.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>📰 Latest News</h2>
        <button onClick={fetchNews} className={styles.refreshBtn}>
          🔄 Refresh
        </button>
      </div>

      <div className={styles.newsGrid}>
        {news.map((item) => (
          <article key={item.id} className={styles.newsCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.newsTitle}>
                {item.link ? (
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.titleLink}
                  >
                    {stripHtml(item.title.rendered)}
                  </a>
                ) : (
                  stripHtml(item.title.rendered)
                )}
              </h3>
              <span className={styles.source}>{item.source || "MongoDB Feed"}</span>
            </div>

            <p className={styles.excerpt}>
              {stripHtml(item.excerpt?.rendered || item.content?.rendered || "").slice(0, 160)}
              {stripHtml(item.excerpt?.rendered || item.content?.rendered || "").length > 160 ? "..." : ""}
            </p>

            <div className={styles.cardFooter}>
              <time className={styles.date}>
                {new Date(item.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.readMore}
                >
                  Read more →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}