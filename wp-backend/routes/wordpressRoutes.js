//wp-backend/routes/wordpressRoutes.js

import express from "express";
import { fetchWpPosts } from "../services/wpService.js";

const router = express.Router();

router.get("/posts", async (req, res) => {
  try {
    const posts = await fetchWpPosts();
    res.json(posts);
  } catch (err) {
    console.error("Failed to fetch WP posts:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
