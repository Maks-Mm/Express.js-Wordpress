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
}

export default function Posts() {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/posts");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: WordPressPost[] = await response.json();
        setPosts(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load posts:", err);
        setError("Failed to load posts. Please check if the server is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-red-500 mt-2">
            Make sure your Express server is running on port 5000
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Enhanced Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
        <p className="text-xl text-gray-600">Latest updates and articles</p>
      </header>

      {/* Posts Grid */}
      <div className="flex flex-col items-center">
        {posts.map((post) => (
          <article 
            key={post.id} 
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden w-full max-w-3xl mb-8"
          >
            <div className="p-6 text-center">
              {/* Post Header */}
              <div className="mb-4">
                <h2 
                  className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }} 
                />
                <time className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString()}
                </time>
              </div>

              {/* Post Content */}
              <div 
                className="prose prose-lg max-w-none 
                  prose-headings:text-gray-800
                  prose-p:text-gray-600
                  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-xl prose-img:shadow-md
                  prose-blockquote:border-blue-200 prose-blockquote:bg-blue-50
                  prose-strong:text-gray-800
                  prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded
                  text-center mx-auto
                  
                  /* WordPress block centering */
                  [&_.wp-block-image]:mx-auto
                  [&_.wp-block-image]:text-center
                  [&_.wp-block-gallery]:flex
                  [&_.wp-block-gallery]:justify-center
                  [&_.wp-block-gallery]:items-center"
                dangerouslySetInnerHTML={{ __html: post.content.rendered }} 
              />

              {/* Read More Button */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                  Read Full Article
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}