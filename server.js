import express from "express";
import axios from "axios";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import News from "./wp-backend/models/News.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { MONGODB_URI, MONGODB_DB_NAME } = process.env;

mongoose
  .connect(MONGODB_URI, {
    dbName: MONGODB_DB_NAME,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// WordPress API configuration
const WP_API = "https://public-api.wordpress.com/wp/v2/sites/firstproduc.wordpress.com";

// 📥 Get all MongoDB news (remove duplicate endpoint)
app.get("/api/mongo/news", async (req, res) => {
  try {
    const mongoNews = await News.find().sort({ date: -1 }).lean();
    
    // Transform to match WordPress post structure
    const transformedNews = mongoNews.map((item, index) => ({
      id: `mongo-${item._id}`,
      title: { rendered: item.title },
      content: { 
        rendered: item.content || item.description || "No content available" 
      },
      excerpt: { 
        rendered: item.description || item.content?.slice(0, 150) + "..." || "Read more..." 
      },
      date: item.date || new Date().toISOString(),
      slug: `news-${index}`,
      type: "news",
      source: item.source || "MongoDB Feed",
      link: item.link || "#",
      featured_media: null
    }));
    
    res.json(transformedNews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// WordPress posts endpoint
app.get("/api/posts", async (req, res) => {
  console.log("📥 Fetching posts from WordPress...");
  try {
    const url = `${WP_API}/posts?per_page=100&_fields=id,title,content,excerpt,date,slug,featured_media,link`;
    console.log("🔗 URL:", url);
    const wpResponse = await axios.get(url);
    
    console.log("📝 Raw WordPress posts:", wpResponse.data.length);
    
    const transformedPosts = wpResponse.data.map(post => ({
      id: `wp-${post.id}`,
      title: { rendered: post.title.rendered || post.title },
      content: { rendered: post.content.rendered || post.content },
      excerpt: { 
        rendered: post.excerpt.rendered || 
                 (post.content.rendered ? post.content.rendered.replace(/<[^>]*>/g, '').slice(0, 150) + '...' : 'No excerpt')
      },
      date: post.date,
      slug: post.slug,
      link: post.link,
      featured_media: post.featured_media,
      type: "wp",
      source: "WordPress"
    }));
    
    console.log(`✅ Received ${transformedPosts.length} WordPress posts`);
    transformedPosts.forEach((post, index) => {
      console.log(`   📖 ${index + 1}: "${post.title.rendered}"`);
    });
    
    res.json(transformedPosts);
  } catch (err) {
    console.error("❌ Error fetching WordPress posts:", err.response?.data || err.message);
    res.status(500).json({
      error: "Failed to fetch WordPress posts",
      details: err.response?.data || err.message
    });
  }
});

// Dortmund news endpoint (static news)
app.get("/api/news", async (req, res) => {
  console.log("📰 Fetching Dortmund news...");
  try {
    const dortmundNews = [
      {
        id: "news-1",
        title: { rendered: "Dortmund City Development News" },
        content: { rendered: "Latest urban development updates from Dortmund city administration. New infrastructure projects and community initiatives." },
        excerpt: { rendered: "Latest urban development updates from Dortmund city administration. New infrastructure projects and community initiatives." },
        date: new Date().toISOString(),
        slug: "dortmund-city-development",
        type: "news",
        source: "Stadt Dortmund",
        link: "https://www.bild.de/regional/dortmund/"
      },
      {
        id: "news-2", 
        title: { rendered: "Urban Planning Committee Decisions" },
        content: { rendered: "Recent urban planning committee meeting results affecting Dortmund's city development and public spaces." },
        excerpt: { rendered: "Recent urban planning committee meeting results affecting Dortmund's city development and public spaces." },
        date: new Date(Date.now() - 2 * 86400000).toISOString(),
        slug: "urban-planning-committee",
        type: "news",
        source: "Dortmund City Council",
        link: "https://www.ruhrnachrichten.de/dortmund/"
      },
      {
        id: "news-3",
        title: { rendered: "Public Transportation Expansion" },
        content: { rendered: "Dortmund announces new public transportation routes and sustainable mobility initiatives for better city connectivity." },
        excerpt: { rendered: "Dortmund announces new public transportation routes and sustainable mobility initiatives for better city connectivity." },
        date: new Date(Date.now() - 5 * 86400000).toISOString(),
        slug: "public-transportation",
        type: "news",
        source: "Dortmund Transport Authority",
        link: "https://www.dortmund.de/en/transport"
      }
    ];
    
    console.log(`✅ Sent ${dortmundNews.length} static Dortmund news items`);
    res.json(dortmundNews);
  } catch (err) {
    console.error("❌ Error with news:", err.message);
    res.status(500).json({
      error: "Failed to fetch news",
      details: err.message
    });
  }
});

// Combined content endpoint - FIXED VERSION
app.get("/api/content", async (req, res) => {
  console.log("🔄 Fetching combined content...");

  try {
    // Use Promise.allSettled to handle partial failures
    const [postsResult, mongoResult, staticNewsResult] = await Promise.allSettled([
      axios.get(`http://localhost:5000/api/posts`).catch(err => {
        console.error("WordPress posts failed:", err.message);
        return { data: [] };
      }),
      News.find().sort({ date: -1 }).lean().catch(err => {
        console.error("MongoDB fetch failed:", err.message);
        return [];
      }),
      axios.get(`http://localhost:5000/api/news`).catch(err => {
        console.error("Static news fetch failed:", err.message);
        return { data: [] };
      })
    ]);

    // Process WordPress posts
    const wpPosts = postsResult.status === 'fulfilled' ? postsResult.value.data : [];
    console.log(`📝 WordPress posts found: ${wpPosts.length}`);

    // Process MongoDB news
    const mongoNews = mongoResult.status === 'fulfilled' 
      ? mongoResult.value.map((item, index) => ({
          id: `mongo-${item._id || index}`,
          title: { rendered: item.title },
          content: { rendered: item.content || item.description || "" },
          excerpt: { rendered: item.description || (item.content ? item.content.slice(0, 100) + "..." : "") },
          date: item.date || new Date().toISOString(),
          slug: `mongo-${index}`,
          type: "news",
          source: item.source || "MongoDB",
          link: item.link || "#"
        }))
      : [];

    // Process static Dortmund news
    const staticNews = staticNewsResult.status === 'fulfilled' 
      ? staticNewsResult.value.data.map(item => ({
          ...item,
          id: `static-${item.id}`,
          type: "news",
        }))
      : [];

    const combined = [...wpPosts, ...mongoNews, ...staticNews].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    console.log(`✅ Combined total: ${combined.length} items`);
    console.log(`   📄 WordPress: ${wpPosts.length} posts`);
    console.log(`   🗄️  MongoDB: ${mongoNews.length} items`); 
    console.log(`   📰 Static Dortmund: ${staticNews.length} items`);
    
    // Log all content for debugging
    wpPosts.forEach((post, index) => {
      console.log(`   📖 WP ${index + 1}: "${post.title.rendered}"`);
    });
    mongoNews.forEach((news, index) => {
      console.log(`   🗄️  Mongo ${index + 1}: "${news.title.rendered}"`);
    });
    staticNews.forEach((news, index) => {
      console.log(`   📰 Static ${index + 1}: "${news.title.rendered}"`);
    });

    res.json(combined);
    
  } catch (err) {
    console.error("❌ Error in combined content:", err.message);
    res.status(500).json({ 
      error: "Failed to fetch combined content",
      details: err.message 
    });
  }
});

// Debug endpoint to check WordPress API directly
app.get("/api/debug/wordpress", async (req, res) => {
  try {
    const response = await axios.get(`${WP_API}/posts`);
    res.json({
      totalPosts: response.data.length,
      posts: response.data.map(post => ({
        id: post.id,
        title: post.title.rendered,
        date: post.date,
        status: post.status,
        excerpt: post.excerpt.rendered?.substring(0, 100) + '...'
      }))
    });
  } catch (err) {
    res.status(500).json({ 
      error: err.message,
      response: err.response?.data 
    });
  }
});

// Health check endpoint
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
  console.log("   GET /api/mongo/news - MongoDB news only");
  console.log("   GET /api/content - Combined posts + news");
  console.log("   GET /api/debug/wordpress - WordPress debug");
});