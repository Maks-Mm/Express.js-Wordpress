import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface NewsItem {
  date: string;
  type: string;
}

interface Props {
  newsItems: NewsItem[];
}

export default function NewsInsertChart({ newsItems }: Props) {
  // Aggregate counts per day
  const data = useMemo(() => {
    const counts: Record<string, number> = {};

    newsItems.forEach(item => {
      const date = new Date(item.date);
      if (isNaN(date.getTime())) return; // skip invalid
      const day = date.toISOString().split("T")[0];
      counts[day] = (counts[day] || 0) + 1;
    });

    return Object.entries(counts)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, count]) => ({ date, count }));
  }, [newsItems]);

  if (data.length === 0) {
    return (
      <div className="text-center text-gray-500 text-sm p-4 border border-gray-200 rounded-xl bg-gray-50">
        ⚠️ No MongoDB news data found for visualization.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-10 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          🗓️ MongoDB Insert Activity
        </h3>
        <span className="text-sm text-gray-500">
          Showing {data.length} days of inserts
        </span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#4b5563" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "#4b5563" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
            labelStyle={{ color: "#111827", fontWeight: 500 }}
            cursor={{ stroke: "#d1fae5", strokeWidth: 2 }}
          />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="count"
            name="Inserts per day"
            stroke="#16a34a"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#16a34a" }}
            activeDot={{ r: 6, stroke: "#15803d", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <p className="text-sm text-gray-500 text-center mt-4">
        This visualization shows how many new documents were inserted into your MongoDB cluster per day.
      </p>
    </div>
  );
}
