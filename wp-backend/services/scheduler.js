import cron from 'node-cron';
import DortmundNewsScraper from './newsScraper.js';
import News from '../models/News.js';

export default class Scheduler {
  constructor() {
    this.scraper = new DortmundNewsScraper();
    this.isScraping = false;
  }

  start() {
    // Schedule scraping every 6 hours
    const cronExpr = process.env.SCRAPE_CRON || '0 */6 * * *';
    
    cron.schedule(cronExpr, async () => {
      await this.scrapeNow();
    });

    console.log('✅ Scheduler started with cron:', cronExpr);

    // Initial scrape after 10 seconds
    setTimeout(() => {
      this.scrapeNow();
    }, 10000);
  }

  async scrapeNow() {
    if (this.isScraping) {
      console.log('⏳ Scraping already in progress, skipping...');
      return;
    }

    this.isScraping = true;
    console.log('🔄 Starting scheduled scrape...');

    try {
      const scrapedItems = await this.scraper.scrapeAll();
      let inserted = 0;

      for (const item of scrapedItems) {
        try {
          await News.findOneAndUpdate(
            { link: item.link },
            { ...item, scrapedAt: new Date() },
            { upsert: true, new: true }
          );
          inserted++;
        } catch (dbError) {
          console.error('❌ DB error for item:', item.title, dbError.message);
        }
      }

      console.log(`✅ Scraping completed: ${inserted} items processed`);
    } catch (error) {
      console.error('❌ Scraping failed:', error.message);
    } finally {
      this.isScraping = false;
    }
  }
}