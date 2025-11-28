// frontend/src/hooks/usePaginatedNews.ts
import { useState, useCallback } from "react";

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}

export default function usePaginatedNews<T = any>(
  initialPage = 1,
  pageSize = 6
) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(async (p?: number) => {
    const currentPage = p ?? page;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `http://localhost:5000/api/news?page=${currentPage}&limit=${pageSize}`
      );
      if (!res.ok) throw new Error(`Status: ${res.status}`);
  
      const json: PaginatedResponse<T> = await res.json();

      setItems(prev =>
        currentPage === initialPage ? json.items : [...prev, ...json.items]
      );

      setPage(currentPage + 1);
      setHasMore(currentPage * json.limit < json.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [pageSize, initialPage, page]); // page only used when p is undefined

  const reset = useCallback(() => {
    setItems([]);
    setPage(initialPage);
    setHasMore(true);
    setError(null);
  }, [initialPage]);

  return { items, loadPage, reset, loading, hasMore, error };
}
