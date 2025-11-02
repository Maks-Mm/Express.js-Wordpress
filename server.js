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

const WP_API = "https://public-api.wordpress.com/wp/v2/sites/firstproduc.wordpress.com";

const { MONGODB_URI, MONGODB_DB_NAME } = process.env;

mongoose
  .connect(MONGODB_URI, {
    dbName: MONGODB_DB_NAME,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));



app.post("/api/mongo/news", async (req, res) => {
  try {
    const { title, description, content, link, date, source } = req.body;
    const newItem = new News({ title, description, content, link, date, source });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📥 Get all MongoDB news
app.get("/api/mongo/news", async (req, res) => {
  try {
    const mongoNews = await News.find().sort({ date: -1 }).lean();
    res.json(mongoNews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




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
        link: "https://www.bild.de/regional/dortmund/home-tEfE9FBcspDqbA9qV8Aj",
        description: "Latest urban development updates from Dortmund city administration. New infrastructure projects and community initiatives.",
        date: new Date().toISOString(),
        source: "Stadt Dortmund",
        type: "news"
      },
      {
        id: "news-2", 
        title: "Urban Planning Committee Decisions",
        link: "https://www.ruhrnachrichten.de/dortmund/",
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
  console.log("🔄 Fetching combined posts, static news, and MongoDB content...");

  try {
    const [postsResponse, newsResponse, mongoNews] = await Promise.all([
      axios.get(`http://localhost:5000/api/posts`).catch(err => {
        console.error("WordPress posts fetch failed:", err.message);
        return { data: [] };
      }),
      axios.get(`http://localhost:5000/api/news`).catch(err => {
        console.error("Static news fetch failed:", err.message);
        return { data: [] };
      }),
      News.find().sort({ date: -1 }).lean().catch(err => {
        console.error("MongoDB fetch failed:", err.message);
        return [];
      })
    ]);

    const posts = postsResponse.data.map(post => ({
      ...post,
      type: "wp",
      id: `wp-${post.id}`,
    }));

    const staticNews = newsResponse.data.map(item => ({
      ...item,
      type: "news",
      title: { rendered: item.title },
      excerpt: { rendered: item.description || "" },
      content: { rendered: item.description || "" },
      date: item.date,
      slug: item.id,
    }));

    const mongoFormatted = mongoNews.map((item) => ({
      ...item,
      id: `mongo-${item._id}`,
      title: { rendered: item.title },
      excerpt: { rendered: item.description || item.content?.slice(0, 150) || "" },
      content: { rendered: item.content || item.description || "" },
      date: item.date || new Date().toISOString(),
      source: item.source || "MongoDB Feed",
      type: "news",
    }));

    const combined = [...posts, ...staticNews, ...mongoFormatted].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    console.log(
      `✅ Combined total: ${combined.length} items (${posts.length} WP + ${staticNews.length} static + ${mongoFormatted.length} Mongo)`
    );
    res.json(combined);
  } catch (err) {
    console.error("❌ Error fetching combined content:", err.message);
    res.status(500).json({
      error: "Failed to fetch combined content",
      details: err.message,
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