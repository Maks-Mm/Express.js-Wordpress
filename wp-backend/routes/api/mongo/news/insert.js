// /wp-backend/routes/api/mongo/news/insert.js
import express from "express";
import News from "../../../models/News.js";

const router = express.Router();

// ✅ POST endpoint for inserting MongoDB news with date support
router.post("/", async (req, res) => {
  try {
    const { title, content, description, source, link, date } = req.body;

    const newNews = new News({
      title,
      content,
      description,
      source,
      link,
      date: date ? new Date(date) : new Date(), // ✅ if client sends date, use it
      scrapedAt: new Date(),
    });

    const savedNews = await newNews.save();
    res.status(201).json(savedNews);
  } catch (error) {
    console.error("Error inserting MongoDB news:", error);
    res.status(500).json({ error: "Failed to insert news item" });
  }
});

export default router;
