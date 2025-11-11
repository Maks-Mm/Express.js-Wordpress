// wp-backend/routes/api/mongo/news/insert.js
import express from "express";
import News from "../../../models/News.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { title, content, description, source, link, date } = req.body;

    // Basic validation
    if (!title || !content) {
      return res.status(400).json({ error: "Missing title or content" });
    }

    // Create new document
    const savedNews = await News.create({
      title,
      content,
      description,
      source,
      link,
      date: date ? new Date(date) : new Date(), // fallback to current date
      scrapedAt: new Date(),
    });

    res.status(201).json(savedNews);
  } catch (error) {
    console.error("Error inserting MongoDB news:", error);
    res.status(500).json({ error: "Failed to insert news item" });
  }
});

export default router;
