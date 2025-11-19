// frontend/src/components/NewsTable.tsx

import { useEffect, useState } from "react";

interface NewsItem {
  id: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  source?: string;
  date: string;
  link?: string;
}

export default function NewsTable() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/mongo/news");
      const data = await res.json();
      setNews(data);
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) return <p className="text-center py-10">Loading MongoDB data...</p>;

  if (news.length === 0)
    return <p className="text-center py-10">No MongoDB data found.</p>;

  return (
    <div className="overflow-x-auto mt-10">
      <h2 className="text-xl font-bold mb-4">📊 MongoDB News Table</h2>

      <table className="min-w-full text-sm border border-gray-300 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Source</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Link</th>
            <th className="p-3 text-left">Excerpt</th>
          </tr>
        </thead>

        <tbody>
          {news.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="p-3">{item.title.rendered}</td>
              <td className="p-3">{item.source || "MongoDB Feed"}</td>
              <td className="p-3">
                {new Date(item.date).toLocaleString("en-US")}
              </td>
              <td className="p-3">
                <a
                  href={item.link || "#"}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  Open ↗
                </a>
              </td>
              <td className="p-3 text-gray-600">
                {item.excerpt?.rendered?.replace(/<[^>]+>/g, "").slice(0, 120) + "..."}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={fetchNews}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        🔄 Refresh Table
      </button>
    </div>
  );
}
