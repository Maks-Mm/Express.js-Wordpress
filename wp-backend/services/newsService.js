// wp-backend/services/newsService.js
import News from "../models/News.js";

/**
 * Returns paginated items and total count
 * @param {number|string} page
 * @param {number|string} limit
 * @returns {Promise<{docs: Array, total: number}>}
 */
export async function getPaginatedNews(page = 1, limit = 10) {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.max(1, parseInt(limit, 10) || 10);
  const skip = (p - 1) * l;

  const [docs, total] = await Promise.all([
    News.find().sort({ date: -1 }).skip(skip).limit(l).lean(),
    News.countDocuments()
  ]);

  return { docs, total };
}
