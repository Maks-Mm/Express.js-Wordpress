// frontend/src/components/NewsInsertChart.tsx

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

import styles from './NewsInsertChart.module.css';

interface NewsItem {
  date: string;
  type: string;
}

interface Props {
  newsItems: NewsItem[];
}

export default function NewsInsertChart({ newsItems }: Props) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    newsItems.forEach((item) => {
      const date = new Date(item.date);
      if (isNaN(date.getTime())) return;
      const day = date.toISOString().split("T")[0];
      counts[day] = (counts[day] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, count]) => ({ date, count }));
  }, [newsItems]);

  if (data.length === 0) {
    return (
      <div className={styles.glassCard}>
        <div className={styles.empty}>⚠️ No MongoDB news data found for visualization.</div>
      </div>
    );
  }

  return (
    <div className={styles.glassCard}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <span className={styles.titleIcon}>🗓️</span>
          MongoDB Insert Activity
        </h3>
        <span className={styles.subtitle}>Showing {data.length} days of inserts</span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: "rgba(255, 255, 255, 0.8)" }} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            allowDecimals={false} 
            tick={{ fontSize: 12, fill: "rgba(255, 255, 255, 0.8)" }} 
            tickLine={false} 
            axisLine={false} 
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: "rgba(255, 255, 255, 0.9)", 
              backdropFilter: "blur(10px)",
              borderRadius: "8px", 
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "#111827"
            }}
            labelStyle={{ color: "#111827", fontWeight: 500 }}
            cursor={{ stroke: "rgba(22, 163, 74, 0.3)", strokeWidth: 2 }}
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

      <p className={styles.description}>
        This visualization shows how many new documents were inserted into your MongoDB cluster per day.
      </p>
    </div>
  );
}