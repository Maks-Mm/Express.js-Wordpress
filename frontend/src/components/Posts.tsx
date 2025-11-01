import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

interface ContentItem {
  id: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  slug: string;
  featured_media?: number;
  type: 'wp' | 'news';
  link?: string;
  source?: string;
}

export default function Posts() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'posts' | 'news'>('all');

  useEffect(() => {
    fetchContent();
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [content, selectedItem]);

  const fetchContent = async () => {
    setLoading(true);
    setError(null);
    setSelectedItem(null);

    try {
      const res = await fetch("http://localhost:5000/api/content");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data: ContentItem[] = await res.json();
      console.log("📥 Received content:", data.length, "items");
      setContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item: ContentItem) => {
    setSelectedItem(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackClick = () => setSelectedItem(null);

  const filteredContent = content.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'posts') return item.type === 'wp';
    if (activeTab === 'news') return item.type === 'news';
    return true;
  });

  // Count items for tabs
  const wpCount = content.filter(item => item.type === 'wp').length;
  const newsCount = content.filter(item => item.type === 'news').length;

  // Define tabConfig once at the component level
  const tabConfig = [
    { 
      key: 'all' as const, 
      label: 'All', 
      count: content.length,
      icon: '📚'
    },
    { 
      key: 'posts' as const, 
      label: 'Posts', 
      count: wpCount,
      icon: '✍️'
    },
    { 
      key: 'news' as const, 
      label: 'News', 
      count: newsCount,
      icon: '⚽'
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] text-center" data-aos="fade-up">
        <div className="loader mb-3"></div>
        <p className="text-gray-600">Loading content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16" data-aos="fade-up">
        <p className="text-red-400 font-semibold mb-4">⚠️ {error}</p>
        <button onClick={fetchContent} className="btn-glass">
          Try Again
        </button>
      </div>
    );
  }

  if (selectedItem) {
    const isNews = selectedItem.type === 'news';
    
    return (
      <div className="max-w-3xl mx-auto post-card mt-8" data-aos="fade-up">
        <button onClick={handleBackClick} className="btn-glass mb-6">
          ← Back to {isNews ? 'News' : 'Posts'}
        </button>

        {isNews && (
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
              {selectedItem.source}
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
              News
            </span>
          </div>
        )}

        <h1
          className="text-3xl font-bold text-gray-900 mb-2"
          dangerouslySetInnerHTML={{ __html: selectedItem.title.rendered }}
        />
        <p className="text-sm text-gray-500 mb-6">
          {new Date(selectedItem.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        {isNews ? (
          <div className="wp-content prose prose-lg max-w-none">
            <div
              className="text-gray-700 leading-relaxed mb-6"
              dangerouslySetInnerHTML={{ __html: selectedItem.content.rendered }}
            />
            <a 
              href={selectedItem.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-glass inline-flex items-center gap-2"
            >
              Read Full Article ↗
            </a>
          </div>
        ) : (
          <div
            className="wp-content prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: selectedItem.content.rendered }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <header className="text-center mb-10" data-aos="fade-down">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">News & Blog</h1>
        <p className="text-lg text-gray-600 mb-2">Latest posts and Dortmund news</p>
        {content.length > 0 && (
          <p className="text-sm text-gray-500">
            Showing {filteredContent.length} item{filteredContent.length !== 1 ? "s" : ""}
            {activeTab === 'all' && ` (${wpCount} posts + ${newsCount} news)`}
          </p>
        )}
      </header>

      {/* Tab Navigation - Using tabConfig */}
      <div className="flex justify-center mb-8">
        {tabConfig.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            aria-selected={activeTab === tab.key}
            role="tab"
            className={`
              px-4 py-3 rounded-xl text-sm font-medium mx-2
              flex items-center gap-2 transition-all duration-300
              backdrop-blur-md border min-w-[90px]
              ${activeTab === tab.key
                ? 'bg-white/20 text-white border-white/40 shadow-lg transform scale-105'
                : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/15 hover:border-white/30'
              }
            `}
          >
            <span className="text-base">{tab.icon}</span>
            <div className="flex flex-col items-start">
              <span className="text-xs font-semibold whitespace-nowrap">{tab.label}</span>
              <span className="text-xs font-bold mt-0.5 text-white/70">
                {tab.count} items
              </span>
            </div>
          </button>
        ))}
      </div>

      {filteredContent.length === 0 ? (
        <div className="text-center py-12" data-aos="fade-up">
          <p className="text-gray-500 text-lg mb-4">No content found.</p>
          <button onClick={fetchContent} className="btn-glass">
            Refresh Content
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredContent.map((item, index) => (
            <article
              key={item.id}
              className="post-card hover:shadow-xl transition-all duration-300"
              data-aos={index % 2 === 0 ? "fade-up" : "fade-right"}
            >
              {item.type === 'news' && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    {item.source}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                    News
                  </span>
                </div>
              )}

              <h2
                className="text-2xl font-semibold text-gray-900 mb-1 hover:text-blue-400 transition-colors cursor-pointer"
                onClick={() => handleItemClick(item)}
                dangerouslySetInnerHTML={{ __html: item.title.rendered }}
              />
              <p className="text-sm text-gray-500 mb-3">
                {new Date(item.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <div
                className="text-gray-700 leading-relaxed mb-4"
                dangerouslySetInnerHTML={{
                  __html:
                    item.excerpt.rendered.length > 200
                      ? item.excerpt.rendered.slice(0, 200) + "..."
                      : item.excerpt.rendered,
                }}
              />

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleItemClick(item)}
                  className="btn-glass"
                >
                  Read {item.type === 'news' ? 'Full Article' : 'More'}
                </button>
                {item.type === 'news' && (
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Open Original ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}