import { useEffect, useState } from "react";
import "../styles/wordpress.css";

interface WordPressPost {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  date: string;
  excerpt: {
    rendered: string;
  };
  slug: string;
  featured_media?: number;
}

export default function Posts() {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<WordPressPost | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("http://localhost:5000/api/posts");
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
      }
      
      const data: WordPressPost[] = await response.json();
      setPosts(data);
    } catch (err) {
      console.error("Failed to load posts:", err);
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (post: WordPressPost) => {
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackClick = () => {
    setSelectedPost(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Posts</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchPosts}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Single post view
  if (selectedPost) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={handleBackClick}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to all posts
        </button>

        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            <header className="text-center mb-8">
              <h1 
                className="text-3xl font-bold text-gray-900 mb-4"
                dangerouslySetInnerHTML={{ __html: selectedPost.title.rendered }} 
              />
              <div className="flex justify-center items-center text-gray-500 text-sm">
                <time>{new Date(selectedPost.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</time>
              </div>
            </header>

            <div 
              className="prose prose-lg max-w-none 
                prose-headings:text-gray-800 prose-headings:font-bold
                prose-p:text-gray-600 prose-p:leading-relaxed
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-lg
                prose-blockquote:not-italic
                prose-strong:text-gray-800
                prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono
                prose-pre:bg-gray-900 prose-pre:text-gray-100
                prose-ul:list-disc prose-ol:list-decimal
                prose-li:marker:text-gray-400
                prose-table:overflow-hidden prose-table:rounded-lg
                prose-th:bg-gradient-to-r prose-th:from-blue-600 prose-th:to-blue-700 prose-th:text-white
                prose-td:border-gray-200
                
                /* WordPress specific overrides */
                [&_.wp-block-image]:!my-8
                [&_.wp-block-quote]:!my-8
                [&_.wp-block-gallery]:!my-8
                [&_.wp-block-table]:!my-8
                [&_.wp-block-button]:!my-6"
              dangerouslySetInnerHTML={{ __html: selectedPost.content.rendered }} 
            />
          </div>
        </article>
      </div>
    );
  }

  // Posts list view
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Enhanced Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
        <p className="text-xl text-gray-600">Latest updates and articles</p>
        {posts.length > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            Showing {posts.length} post{posts.length !== 1 ? 's' : ''}
          </p>
        )}
      </header>

      {/* Posts Grid */}
      <div className="flex flex-col items-center">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No posts found.</p>
          </div>
        ) : (
          posts.map((post) => (
            <article 
              key={post.id} 
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden w-full max-w-3xl mb-8 cursor-pointer transform hover:-translate-y-1"
              onClick={() => handlePostClick(post)}
            >
              <div className="p-6 text-center">
                {/* Post Header */}
                <div className="mb-4">
                  <h2 
                    className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }} 
                  />
                  <time className="text-sm text-gray-500">
                    {new Date(post.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </time>
                </div>

                {/* Excerpt */}
                {post.excerpt.rendered && (
                  <div 
                    className="prose prose-gray max-w-none mb-4 text-left"
                    dangerouslySetInnerHTML={{ 
                      __html: post.excerpt.rendered.length > 200 
                        ? post.excerpt.rendered.substring(0, 200) + '...' 
                        : post.excerpt.rendered 
                    }} 
                  />
                )}

                {/* Read More Button */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                    Read Full Article
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}