// frontend/src/components/NewsInsertChart.tsx

import { useMemo, useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

  // Format date for better mobile display
  const formatXAxis = (date: string) => {
    if (isMobile) {
      const d = new Date(date);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    }
    return date;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{`Date: ${label}`}</p>
          <p className={styles.tooltipValue}>
            <span className={styles.tooltipDot}></span>
            {`Inserts: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className={styles.glassCard}>
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>⚠️</span>
          No MongoDB news data found for visualization.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.glassCard}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h3 className={styles.title}>
            <span className={styles.titleIcon}>🗓️</span>
            MongoDB Insert Activity
          </h3>
          <span className={styles.subtitle}>Showing {data.length} days of inserts</span>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
          <LineChart 
            data={data} 
            margin={{ 
              top: 20, 
              right: isMobile ? 10 : 20, 
              left: isMobile ? -10 : 0, 
              bottom: isMobile ? 10 : 5 
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255, 255, 255, 0.15)" 
            />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxis}
              tick={{ 
                fontSize: isMobile ? 10 : 11, 
                fill: "rgba(255, 255, 255, 0.8)" 
              }} 
              tickLine={false} 
              axisLine={false}
              interval={isMobile ? 'preserveStartEnd' : 0}
              minTickGap={isMobile ? 30 : 10}
            />
            <YAxis 
              allowDecimals={false} 
              tick={{ 
                fontSize: isMobile ? 10 : 11, 
                fill: "rgba(255, 255, 255, 0.8)" 
              }} 
              tickLine={false} 
              axisLine={false}
              width={isMobile ? 25 : 35}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ 
                stroke: "rgba(22, 163, 74, 0.3)", 
                strokeWidth: 2 
              }}
            />
            <Legend 
              verticalAlign="top" 
              height={30}
              wrapperStyle={{
                fontSize: isMobile ? '11px' : '12px',
                paddingBottom: '10px'
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              name="Inserts per day"
              stroke="#16a34a"
              strokeWidth={isMobile ? 2 : 2.5}
              dot={isMobile ? false : { r: 3, fill: "#16a34a" }}
              activeDot={{ 
                r: isMobile ? 4 : 5, 
                stroke: "#15803d", 
                strokeWidth: 2 
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className={styles.description}>
        This visualization shows how many new documents were inserted into your MongoDB cluster per day.
      </p>
    </div>
  );
}