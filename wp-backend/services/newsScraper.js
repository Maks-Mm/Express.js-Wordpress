import axios from "axios";
import * as cheerio from "cheerio";

export default class DortmundNewsScraper {
  constructor() {
    this.sources = [
      { 
        name: 'Stadt Dortmund', 
        url: 'https://www.dortmund.de/de/leben_in_dortmund/medien/aktuelle_nachrichten/index.html', 
        base: 'https://www.dortmund.de' 
      }
    ];
  }

  async scrapeAll() {
    const allItems = [];
    
    for (const source of this.sources) {
      try {
        console.log(`🔍 Scraping ${source.name}...`);
        const items = await this.scrapeSource(source);
        allItems.push(...items);
      } catch (error) {
        console.error(`❌ Error scraping ${source.name}:`, error.message);
      }
    }

    return this.dedupe(allItems);
  }

  async scrapeSource(source) {
    try {
      const response = await axios.get(source.url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      const items = [];

      // Try multiple selectors for different page structures
      $('.news-list-item, .teaser, article, .news-item, .item, .news').each((index, element) => {
        try {
          const $el = $(element);
          
          // Extract title
          const title = $el.find('h2, h3, .title, .news-title, a').first().text().trim();
          if (!title || title.length < 5) return;

          // Extract link
          let link = $el.find('a').attr('href') || '';
          if (link && !link.startsWith('http')) {
            link = source.base + link;
          }
          if (!link) return;

          // Extract description
          const description = $el.find('p, .description, .excerpt, .summary').first().text().trim() || 
                            title.substring(0, 200) + '...';

          // Extract date - try multiple date formats
          const dateText = $el.find('.date, time, .news-date, .published').text().trim();
          const date = this.parseDate(dateText);

          items.push({
            title,
            link,
            description,
            date,
            source: source.name,
            imageUrl: $el.find('img').attr('src') || ''
          });
        } catch (itemError) {
          console.error('Error parsing item:', itemError.message);
        }
      });

      // If no items found with common selectors, try a more generic approach
      if (items.length === 0) {
        $('a').each((index, element) => {
          const $el = $(element);
          const title = $el.text().trim();
          const link = $el.attr('href');
          
          if (title && title.length > 10 && link && link.includes('/news/')) {
            let fullLink = link;
            if (!fullLink.startsWith('http')) {
              fullLink = source.base + fullLink;
            }
            
            items.push({
              title,
              link: fullLink,
              description: title,
              date: new Date(),
              source: source.name,
              imageUrl: ''
            });
          }
        });
      }

      console.log(`✅ ${source.name}: Found ${items.length} items`);
      return items;

    } catch (error) {
      console.error(`❌ Failed to scrape ${source.name}:`, error.message);
      return [];
    }
  }

  parseDate(dateText) {
    if (!dateText) return new Date();
    
    // Try to parse common German date formats
    const cleanDate = dateText.replace(/\./g, '/').trim();
    const parsed = new Date(cleanDate);
    
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }

  dedupe(items) {
    const seen = new Set();
    return items.filter(item => {
      const key = item.link.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}