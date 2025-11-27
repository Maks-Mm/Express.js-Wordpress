// wp-backend/routes/newsRoutes.js

import express from "express";
import { getPaginatedNews } from "../services/newsService.js";

const router = express.Router();

router.get("/news", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const news = await getPaginatedNews(page, limit);
    res.json(news);
  } catch (error) {
    console.error("❌ Error in /news:", error.message);
    res.status(500).json({ error: "Failed to fetch paginated news" });
  }
});

export default router;
