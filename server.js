import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const WP_API = "https://public-api.wordpress.com/wp/v2/sites/firstproduc.wordpress.com";

// ✅ Your existing WordPress posts endpoint (KEEP THIS - it works)
app.get("/api/posts", async (req, res) => {
  console.log("📥 Fetching posts from WordPress...");
  try {
    const url = `${WP_API}/posts`;
    console.log("🔗 URL:", url);
    const wpResponse = await axios.get(url);
    console.log(`✅ Received ${wpResponse.data.length} posts`);
    res.json(wpResponse.data);
  } catch (err) {
    console.error("❌ Error fetching posts:", err.response?.status, err.message);
    res.status(500).json({
      error: "Failed to fetch posts",
      details: err.response?.data || err.message
    });
  }
});

// ✅ NEW: Dortmund news endpoint 
app.get("/api/news", async (req, res) => {
  console.log("📰 Fetching Dortmund news...");
  try {
    const dortmundNews = [
      {
        id: "news-1",
        title: "Dortmund City Development News",
        link: "https://www.dortmund.de/en/news",
        description: "Latest urban development updates from Dortmund city administration. New infrastructure projects and community initiatives.",
        date: new Date().toISOString(),
        source: "Stadt Dortmund",
        type: "news"
      },
      {
        id: "news-2", 
        title: "Urban Planning Committee Decisions",
        link: "https://www.dortmund.de/en/urban-development",
        description: "Recent urban planning committee meeting results affecting Dortmund's city development and public spaces.",
        date: new Date(Date.now() - 2 * 86400000).toISOString(),
        source: "Dortmund City Council",
        type: "news"
      },
      {
        id: "news-3",
        title: "Public Transportation Expansion",
        link: "https://www.dortmund.de/en/transport", 
        description: "Dortmund announces new public transportation routes and sustainable mobility initiatives for better city connectivity.",
        date: new Date(Date.now() - 5 * 86400000).toISOString(),
        source: "Dortmund Transport Authority",
        type: "news"
      }
    ];
    
    res.json(dortmundNews);
  } catch (err) {
    console.error("❌ Error with news:", err.message);
    res.status(500).json({
      error: "Failed to fetch news",
      details: err.message
    });
  }
});

// ✅ NEW: Combined content endpoint - FIXED VERSION
app.get("/api/content", async (req, res) => {
  console.log("🔄 Fetching combined posts and news...");
  try {
    // Fetch both WordPress posts and Dortmund news in parallel
    const [postsResponse, newsResponse] = await Promise.all([
      axios.get(`http://localhost:5000/api/posts`).catch(err => {
        console.error("WordPress posts fetch failed:", err.message);
        return { data: [] };
      }),
      axios.get(`http://localhost:5000/api/news`).catch(err => {
        console.error("News fetch failed:", err.message);
        return { data: [] };
      })
    ]);

    console.log(`📊 WordPress posts: ${postsResponse.data.length}`);
    console.log(`📊 Dortmund news: ${newsResponse.data.length}`);

    // Format WordPress posts (add type)
    const posts = postsResponse.data.map(post => ({
      ...post,
      type: 'wp',
      id: `wp-${post.id}`
    }));

    // Format news items to match WordPress structure
    const news = newsResponse.data.map(item => ({
      ...item,
      type: 'news',
      // Convert news format to match WordPress post structure
      title: { rendered: item.title },
      excerpt: { rendered: item.description || '' },
      content: { rendered: item.description || '' },
      date: item.date,
      slug: item.id
    }));

    // Combine and sort by date (newest first)
    const combined = [...posts, ...news].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    console.log(`✅ Combined total: ${combined.length} items (${posts.length} posts + ${news.length} news)`);
    res.json(combined);
  } catch (err) {
    console.error("❌ Error fetching combined content:", err.message);
    res.status(500).json({
      error: "Failed to fetch content",
      details: err.message
    });
  }
});

// ✅ Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Server is running with extended features",
    timestamp: new Date().toISOString()
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log("✅ Express backend running on http://localhost:" + PORT);
  console.log("📝 Available endpoints:");
  console.log("   GET /api/health - Health check");
  console.log("   GET /api/posts - WordPress posts only");
  console.log("   GET /api/news - Dortmund news only"); 
  console.log("   GET /api/content - Combined posts + news");
});