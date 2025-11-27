// wp-backend/services/wpService.js
import axios from "axios";

const WP_API_BASE = process.env.WP_API || "https://public-api.wordpress.com/wp/v2/sites/firstproduc.wordpress.com";
let cache = { ts: 0, data: null };
const TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function fetchWpPosts() {
  if (cache.data && Date.now() - cache.ts < TTL_MS) {
    return cache.data;
  }

  const url = `${WP_API_BASE}/posts?per_page=100&_fields=id,title,content,excerpt,date,slug,featured_media,link`;
  const res = await axios.get(url, { timeout: 10000 });
  cache = { ts: Date.now(), data: res.data };
  return res.data;
}
