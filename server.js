import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const WP_API = "https://public-api.wordpress.com/wp/v2/sites/firstproduc.wordpress.com";

// ✅ Fetch public posts with better logging
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


// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.listen(5000, () => {
  console.log("✅ Express backend running on http://localhost:5000");
  console.log("📝 Available endpoints:");
  console.log("   GET /api/health - Health check");
  console.log("   GET /api/posts - Fetch WordPress posts");
});