/*
// frontend/src/store/useContentStore.ts
import { create } from "zustand";
import { ContentItem } from "../types/content";

interface ContentState {
  content: ContentItem[];
  loading: boolean;
  error: string | null;
  selectedItem: ContentItem | null;
  activeTab: 'all' | 'posts' | 'news';
  fetchContent: () => Promise<void>;
  setSelectedItem: (item: ContentItem | null) => void;
  setActiveTab: (tab: 'all' | 'posts' | 'news') => void;
}

export const useContentStore = create<ContentState>((set, get) => ({
  content: [],
  loading: false,
  error: null,
  selectedItem: null,
  activeTab: 'all',
  
  fetchContent: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("http://localhost:5000/api/content");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data: ContentItem[] = await res.json();
      set({ content: data, loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to load content", loading: false });
    }
  },
  
  setSelectedItem: (item) => set({ selectedItem: item }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
*/