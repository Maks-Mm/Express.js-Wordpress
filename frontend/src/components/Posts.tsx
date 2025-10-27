import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

interface WordPressPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  slug: string;
  featured_media?: number;
}

export default function Posts() {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<WordPressPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    // Refresh AOS after posts are loaded or state changes
    AOS.refresh();
  }, [posts, selectedPost]);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    setSelectedPost(null);

    try {
      const res = await fetch("http://localhost:5000/api/posts");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data: WordPressPost[] = await res.json();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (post: WordPressPost) => {
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackClick = () => setSelectedPost(null);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] text-center" data-aos="fade-up">
        <div className="loader mb-3"></div>
        <p className="text-gray-600">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16" data-aos="fade-up">
        <p className="text-red-400 font-semibold mb-4">⚠️ {error}</p>
        <button onClick={fetchPosts} className="btn-glass">
          Try Again
        </button>
      </div>
    );
  }

  if (selectedPost) {
    return (
      <div className="max-w-3xl mx-auto post-card mt-8" data-aos="fade-up">
        <button onClick={handleBackClick} className="btn-glass mb-6">
          ← Back to Posts
        </button>

        <h1
          className="text-3xl font-bold text-gray-900 mb-2"
          dangerouslySetInnerHTML={{ __html: selectedPost.title.rendered }}
        />
        <p className="text-sm text-gray-500 mb-6">
          {new Date(selectedPost.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div
          className="wp-content prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: selectedPost.content.rendered }}
        />

      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <header className="text-center mb-10" data-aos="fade-down">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Blog</h1>
        <p className="text-lg text-gray-600 mb-2">Latest posts and updates</p>
        {posts.length > 0 && (
          <p className="text-sm text-gray-500">
            Showing {posts.length} post{posts.length !== 1 ? "s" : ""}
          </p>
        )}
      </header>

      {posts.length === 0 ? (
        <div className="text-center py-12" data-aos="fade-up">
          <p className="text-gray-500 text-lg mb-4">No posts found.</p>
          <button onClick={fetchPosts} className="btn-glass">
            Refresh Posts
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className="post-card hover:shadow-xl transition-all duration-300"
              data-aos={index % 2 === 0 ? "fade-up" : "fade-right"}
            >
              <h2
                className="text-2xl font-semibold text-gray-900 mb-1 hover:text-blue-400 transition-colors cursor-pointer"
                onClick={() => handlePostClick(post)}
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
              <p className="text-sm text-gray-500 mb-3">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <div
                className="text-gray-700 leading-relaxed mb-4"
                dangerouslySetInnerHTML={{
                  __html:
                    post.excerpt.rendered.length > 200
                      ? post.excerpt.rendered.slice(0, 200) + "..."
                      : post.excerpt.rendered,
                }}
              />

              <button
                onClick={() => handlePostClick(post)}
                className="btn-glass"
              >
                Read Full Article
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
