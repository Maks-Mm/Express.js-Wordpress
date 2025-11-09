//frontend/src/components/Post.tsx

import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import EnhancedFilter from "../components/EnhancedFilter";
import NewsInsertChart from "../components/NewsInsertChart";

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

// Content Error Boundary Component
const ContentErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">There was an error displaying this content.</p>
      </div>
    );
  }

  return <>{children}</>;
};

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

  const renderContent = (content: { rendered: string }) => {
    let cleanContent = content.rendered
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/style="[^"]*color:[^;"]*;?[^"]*"/gi, ''); // remove inline colors
    return { __html: cleanContent };
  };



  const handleItemClick = (item: ContentItem) => {
    setSelectedItem(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackClick = () => setSelectedItem(null);

  // Separate content by type
  const wpContent = content.filter(item => item.type === 'wp');
  const newsContent = content.filter(item => item.type === 'news');

  // Get top 3 WordPress posts for main section
  const topWpPosts = wpContent.slice(0, 3);
  const remainingWpPosts = wpContent.slice(3);

  const filteredContent = content.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'posts') return item.type === 'wp';
    if (activeTab === 'news') return item.type === 'news';
    return true;
  });

  // Count items for tabs
  const wpCount = wpContent.length;
  const newsCount = newsContent.length;

  const tabConfig = [
    {
      key: 'all' as const,
      label: 'All',
      count: content.length,
      icon: '📚'
    },
    {
      key: 'posts' as const,
      label: 'Stable Content',
      count: wpCount,
      icon: '🏛️',
      description: 'WordPress Foundation'
    },
    {
      key: 'news' as const,
      label: 'Live Updates',
      count: newsCount,
      icon: '⚡',
      description: 'MongoDB Stream'
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
          ← Back to {isNews ? 'Live Updates' : 'Stable Content'}
        </button>

        {isNews && (
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
              {selectedItem.source}
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
              Live Update
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
          <ContentErrorBoundary>
            <div className="wp-content prose prose-lg max-w-none">
              <div
                className="wp-content max-w-none"
                dangerouslySetInnerHTML={renderContent(selectedItem.content)}
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
          </ContentErrorBoundary>
        ) : (
          <ContentErrorBoundary>
            <div
              className="wp-content prose prose-lg max-w-none"
              dangerouslySetInnerHTML={renderContent(selectedItem.content)}
            />

          </ContentErrorBoundary>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header Section */}
      <header className="text-center mb-12" data-aos="fade-down">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Dortmund News Hub</h1>
        <p className="text-lg text-gray-600 mb-4">
          Your gateway to BVB news and tech insights
        </p>

        {/* Tech Stack Badge */}
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white text-sm font-medium mb-6">
          <span className="flex items-center gap-1">
            🏛️ WordPress + ⚡ MongoDB
          </span>
          <span className="text-white/70">|</span>
          <span>Powered by Advanced Scraper Technology</span>
        </div>

        {content.length > 0 && (
          <>
            <p className="text-sm text-gray-500">
              {filteredContent.length} items loaded • {wpCount} stable posts • {newsCount} live updates
            </p>

            {/* Enhanced Debug section */}
            <div className="text-xs text-white mt-2 p-2 rounded">
              <div><strong>Debug:</strong> {wpContent.length} WP posts | {newsContent.length} News items</div>
              <div className="mt-1">
                <strong>WP Titles:</strong> {wpContent.map(p => p.title.rendered).join(', ')}
              </div>
              <div className="mt-1">
                <strong>News Titles:</strong> {newsContent.map(p => p.title.rendered).join(', ')}
              </div>
            </div>

          </>
        )}
      </header>

      {/* Rest of your component remains the same... */}


      NewsInsertChart
      {/* Visualization block for MongoDB insert dates */}
      {newsContent.length > 0 && (
        <NewsInsertChart newsItems={newsContent} />
      )}


      {/* Enhanced Filter Component */}
      <EnhancedFilter
        tabs={tabConfig}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showSearch={true}
      />

      {/* Main WordPress Posts Section */}
      {topWpPosts.length > 0 && activeTab !== 'news' && (
        <section className="mb-12" data-aos="fade-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                🏛️ Foundation Posts
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Stable, curated content from our WordPress foundation
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                We are still on WordPress
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Reliable • Structured • Professional
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {topWpPosts.map((item, index) => (
              <article
                key={item.id}
                className="post-card hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500"
                data-aos="zoom-in"
                data-aos-delay={index * 100}
              >
                <div className="bg-blue-50 px-3 py-1 rounded-r-full text-xs text-blue-700 font-medium mb-3 inline-block">
                  Foundation Post
                </div>

                <h2
                  className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer"
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
                  className="text-gray-700 leading-relaxed mb-4 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: item.excerpt.rendered.length > 150
                      ? item.excerpt.rendered.slice(0, 150) + "..."
                      : item.excerpt.rendered,
                  }}
                />

                <button
                  onClick={() => handleItemClick(item)}
                  className="btn-glass bg-blue-500/10 hover:bg-blue-500/20 text-blue-700"
                >
                  Read Foundation Post
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* MongoDB News Section with Special Header */}
      {newsContent.length > 0 && activeTab !== 'posts' && (
        <section className="mb-12" data-aos="fade-up">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 mb-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">⚡</span>
              <h2 className="text-2xl font-bold">Here are top news from Dortmund!</h2>
            </div>
            <p className="text-green-100 text-lg">
              You can observe here new portions of content permanent, follow as we scrape live data from multiple sources!
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-green-200">
              <span className="flex items-center gap-1">
                🔄 Real-time Updates
              </span>
              <span className="flex items-center gap-1">
                🎯 Targeted Scraping
              </span>
              <span className="flex items-center gap-1">
                📊 MongoDB Powered
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {newsContent.slice(0, 4).map((item, index) => (
              <article
                key={item.id}
                className="post-card hover:shadow-xl transition-all duration-300 border-l-4 border-green-500 bg-gradient-to-r from-white to-green-50/30"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                    {item.source}
                  </span>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded">
                    Live Content
                  </span>
                </div>

                <h2
                  className="text-xl font-semibold text-gray-900 mb-2 hover:text-green-600 transition-colors cursor-pointer"
                  onClick={() => handleItemClick(item)}
                  dangerouslySetInnerHTML={{ __html: item.title.rendered }}
                />
                <p className="text-sm text-gray-500 mb-3">
                  {new Date(item.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>

                <div
                  className="text-gray-700 leading-relaxed mb-4 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: item.excerpt.rendered.length > 120
                      ? item.excerpt.rendered.slice(0, 120) + "..."
                      : item.excerpt.rendered,
                  }}
                />

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleItemClick(item)}
                    className="btn-glass bg-green-500/10 hover:bg-green-500/20 text-green-700"
                  >
                    Read Live Update
                  </button>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-500 hover:text-green-600 transition-colors"
                    >
                      Source ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Additional WordPress Posts */}
      {remainingWpPosts.length > 0 && activeTab !== 'news' && (
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            📖 Additional Stable Content
          </h3>
          <div className="grid gap-4">
            {remainingWpPosts.map((item, index) => (
              <article
                key={item.id}
                className="post-card hover:shadow-lg transition-all duration-300"
                data-aos="fade-right"
                data-aos-delay={index * 50}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="bg-blue-100 px-2 py-1 rounded text-xs text-blue-700 font-medium mb-2 inline-block">
                      WordPress
                    </div>
                    <h2
                      className="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors cursor-pointer"
                      onClick={() => handleItemClick(item)}
                      dangerouslySetInnerHTML={{ __html: item.title.rendered }}
                    />
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(item.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <div
                      className="text-gray-600 leading-relaxed text-sm mb-3"
                      dangerouslySetInnerHTML={{
                        __html: item.excerpt.rendered.length > 100
                          ? item.excerpt.rendered.slice(0, 100) + "..."
                          : item.excerpt.rendered,
                      }}
                    />
                    <button
                      onClick={() => handleItemClick(item)}
                      className="btn-glass text-sm bg-blue-500/10 hover:bg-blue-500/20 text-blue-700"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {filteredContent.length === 0 && (
        <div className="text-center py-12" data-aos="fade-up">
          <p className="text-gray-500 text-lg mb-4">No content found.</p>
          <button onClick={fetchContent} className="btn-glass">
            Refresh Content
          </button>
        </div>
      )}
    </div>
  );
}