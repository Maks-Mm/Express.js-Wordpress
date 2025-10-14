import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 WordPress base URL
const WP_API = "https://firstproduc.wordpress.com/wp-json/wp/v2";

// ✅ Fetch public posts
app.get("/api/posts", async (req, res) => {
  try {
    const wpResponse = await axios.get(`${WP_API}/posts`);
    res.json(wpResponse.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

app.listen(5000, () => console.log("✅ Express backend running on http://localhost:5000"));
