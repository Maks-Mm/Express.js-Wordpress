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
  className?: string;
  compact?: boolean;
}

export default function NewsInsertChart({ newsItems, className = '', compact = false }: Props) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [screenSize, setScreenSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('lg');

  // Detect screen size and container width
  useEffect(() => {
    const checkSizes = () => {
      const width = window.innerWidth;
      if (width < 360) setScreenSize('xs');
      else if (width < 480) setScreenSize('sm');
      else if (width < 768) setScreenSize('md');
      else if (width < 1024) setScreenSize('lg');
      else setScreenSize('xl');

      // Estimate container width (you can replace this with actual container measurement)
      const container = document.querySelector(`.${styles.glassCard}`) as HTMLElement;
      if (container) {
        const computedStyle = getComputedStyle(container);
        const padding = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
        setContainerWidth(container.offsetWidth - padding);
      }
    };

    checkSizes();
    window.addEventListener('resize', checkSizes);
    
    return () => window.removeEventListener('resize', checkSizes);
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

  // Adaptive formatting based on available width
  const formatXAxis = (date: string) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    
    if (containerWidth < 200 || screenSize === 'xs') {
      return `${day}`; // Just day number for very narrow
    } else if (containerWidth < 300 || screenSize === 'sm') {
      return `${month}/${day}`; // Month/Day for small
    } else if (containerWidth < 400 || screenSize === 'md') {
      const shortMonth = d.toLocaleDateString('en', { month: 'short' });
      return `${shortMonth} ${day}`; // Short month name
    }
    return date; // Full date for larger
  };

  // Dynamic chart height based on available space
  const getChartHeight = () => {
    if (compact) {
      return Math.max(120, Math.min(200, containerWidth * 0.6));
    }
    
    const baseHeight = Math.max(150, Math.min(300, containerWidth * 0.7));
    
    switch (screenSize) {
      case 'xs': return Math.min(140, baseHeight);
      case 'sm': return Math.min(160, baseHeight);
      case 'md': return Math.min(200, baseHeight);
      case 'lg': return Math.min(250, baseHeight);
      default: return Math.min(300, baseHeight);
    }
  };

  // Adaptive data display - reduce data points for very narrow containers
  const displayData = useMemo(() => {
    if (containerWidth < 250 && data.length > 10) {
      // Show every other point for very narrow containers
      return data.filter((_, index) => index % 2 === 0 || index === data.length - 1);
    }
    if (containerWidth < 350 && data.length > 15) {
      // Show fewer points for small containers
      const step = Math.ceil(data.length / 10);
      return data.filter((_, index) => index % step === 0 || index === data.length - 1);
    }
    return data;
  }, [data, containerWidth]);

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

  const chartHeight = getChartHeight();
  const showLegend = containerWidth > 200 && !compact;
  const showDescription = containerWidth > 250 && !compact;

  if (data.length === 0) {
    return (
      <div className={`${styles.glassCard} ${className} ${compact ? styles.compact : ''}`}>
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>⚠️</span>
          <span className={styles.emptyText}>
            {containerWidth < 200 ? 'No data' : 'No data available'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.glassCard} ${className} ${compact ? styles.compact : ''}`}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h3 className={styles.title}>
            <span className={styles.titleIcon}>🗓️</span>
            <span className={styles.titleText}>
              {containerWidth < 200 ? 'Activity' : 
               containerWidth < 300 ? 'DB Activity' : 
               'MongoDB Insert Activity'}
            </span>
          </h3>
          {!compact && (
            <span className={styles.subtitle}>
              {containerWidth < 250 ? 
                `${displayData.length}d` : 
                `Showing ${displayData.length} days`}
            </span>
          )}
        </div>
      </div>

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <LineChart 
            data={displayData} 
            margin={{ 
              top: containerWidth < 250 ? 8 : 12,
              right: containerWidth < 200 ? 2 : containerWidth < 300 ? 5 : 10,
              left: containerWidth < 200 ? -8 : containerWidth < 300 ? -5 : 0,
              bottom: containerWidth < 250 ? 5 : 8
            }}
          >
            <CartesianGrid 
              strokeDasharray={containerWidth < 250 ? "1 1" : "2 2"} 
              stroke="rgba(255, 255, 255, 0.1)" 
              vertical={containerWidth > 300}
            />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxis}
              tick={{ 
                fontSize: Math.max(8, Math.min(12, containerWidth * 0.03)),
                fill: "rgba(255, 255, 255, 0.8)" 
              }} 
              tickLine={false} 
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={Math.max(20, containerWidth * 0.1)}
            />
            <YAxis 
              allowDecimals={false} 
              tick={{ 
                fontSize: Math.max(8, Math.min(12, containerWidth * 0.03)),
                fill: "rgba(255, 255, 255, 0.8)" 
              }} 
              tickLine={false} 
              axisLine={false}
              width={Math.max(15, Math.min(40, containerWidth * 0.08))}
              tickCount={containerWidth < 250 ? 3 : containerWidth < 400 ? 4 : 5}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ 
                stroke: "rgba(22, 163, 74, 0.3)", 
                strokeWidth: 1 
              }}
            />
            {showLegend && (
              <Legend 
                verticalAlign="top" 
                height={containerWidth < 300 ? 20 : 25}
                wrapperStyle={{
                  fontSize: Math.max(9, Math.min(12, containerWidth * 0.025)) + 'px',
                  paddingBottom: '5px'
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey="count"
              name={containerWidth < 250 ? "Inserts" : "Inserts per day"}
              stroke="#16a34a"
              strokeWidth={Math.max(1.2, Math.min(2.5, containerWidth * 0.005))}
              dot={containerWidth > 250 ? { r: Math.max(1, Math.min(3, containerWidth * 0.006)), fill: "#16a34a" } : false}
              activeDot={{ 
                r: Math.max(2, Math.min(5, containerWidth * 0.01)),
                stroke: "#15803d", 
                strokeWidth: 1 
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {showDescription && (
        <p className={styles.description}>
          {containerWidth < 350 ? 
            'Documents inserted per day' : 
            'This visualization shows daily document inserts in your MongoDB cluster.'
          }
        </p>
      )}
    </div>
  );
}