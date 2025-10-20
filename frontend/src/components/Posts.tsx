import { useEffect, useState } from "react";

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
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    setSelectedPost(null);

    try {
      const res = await fetch("http://localhost:5000/api/posts"); // WP API
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

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] text-center">
        <div className="loader border-4 border-gray-200 border-t-blue-600 rounded-full w-10 h-10 animate-spin mb-3"></div>
        <p className="text-gray-600">Loading posts...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 font-semibold mb-4">⚠️ {error}</p>
        <button
          onClick={fetchPosts}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Single post view
  if (selectedPost) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8">
        <button
          onClick={handleBackClick}
          className="text-blue-600 hover:text-blue-800 font-semibold mb-6 transition-colors"
        >
          ← Back
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
          className="prose prose-lg max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: selectedPost.content.rendered }}
        />
      </div>
    );
  }

  // Posts list view
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Blog</h1>
        <p className="text-lg text-gray-600 mb-2">Latest posts and updates</p>
        {posts.length > 0 && (
          <p className="text-sm text-gray-500">
            Showing {posts.length} post{posts.length !== 1 ? "s" : ""}
          </p>
        )}
      </header>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500 text-lg py-12">
          No posts found.
        </p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.id}
              onClick={() => handlePostClick(post)}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer"
            >
              <h2
                className="text-2xl font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors"
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

              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors">
                Read Full Article
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
