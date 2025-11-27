// frontend/src/hooks/usePaginatedNews.ts
import { useState, useCallback, useEffect } from "react";

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}

export default function usePaginatedNews<T = any>(initialPage = 1, pageSize = 6) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(async (p: number = page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/api/news?page=${p}&limit=${pageSize}`);
      if (!res.ok) throw new Error(`Status: ${res.status}`);
      const json: PaginatedResponse<T> = await res.json();

      setItems(prev => (p === initialPage ? json.items : [...prev, ...json.items]));
      setPage(p + 1);
      setHasMore(p * json.limit < json.total);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, initialPage]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(initialPage);
    setHasMore(true);
    setError(null);
  }, [initialPage]);

  return { items, loadPage, reset, loading, hasMore, error };
}
