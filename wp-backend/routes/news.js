// wp-backend/routes/news.js
import express from 'express';
import DortmundNewsScraper from '../services/newsScraper.js';
import News from '../models/News.js';

const router = express.Router();
const scraper = new DortmundNewsScraper();

// GET /api/news - Get all news (paginated)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const items = await News.find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await News.countDocuments();

    res.json({
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching news:', error);
    res.status(500).json({ 
      error: 'Failed to fetch news',
      details: error.message 
    });
  }
});

// POST /api/news/scrape - Manual scrape trigger
router.post('/scrape', async (req, res) => {
  // Basic protection - check for scrape key
  const scrapeKey = req.headers['x-scrape-key'];
  if (scrapeKey !== process.env.SCRAPE_KEY && process.env.SCRAPE_KEY) {
    return res.status(403).json({ 
      error: 'Forbidden - invalid scrape key' 
    });
  }

  try {
    console.log('🔄 Manual scrape triggered...');
    const scrapedItems = await scraper.scrapeAll();
    let inserted = 0;

    for (const item of scrapedItems) {
      try {
        await News.findOneAndUpdate(
          { link: item.link },
          { ...item, scrapedAt: new Date() },
          { upsert: true }
        );
        inserted++;
      } catch (dbError) {
        // Continue on duplicate errors
        if (dbError.code !== 11000) {
          console.error('DB error:', dbError.message);
        }
      }
    }

    res.json({ 
      message: 'Scraping completed', 
      scraped: scrapedItems.length,
      inserted,
      duplicates: scrapedItems.length - inserted
    });

  } catch (error) {
    console.error('❌ Scraping error:', error);
    res.status(500).json({ 
      error: 'Scraping failed',
      details: error.message 
    });
  }
});

// GET /api/news/test - Test scraping without saving
router.get('/test', async (req, res) => {
  try {
    const items = await scraper.scrapeAll();
    res.json({
      message: 'Test scrape completed',
      count: items.length,
      items: items.slice(0, 10) // Return first 10 for inspection
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Test scrape failed',
      details: error.message 
    });
  }
});

export default router;