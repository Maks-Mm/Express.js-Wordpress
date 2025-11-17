// frontend/src/components/EnhancedFilter.tsx
import { useState } from "react"; // Make sure this import exists

export interface FilterTab {
  key: 'all' | 'posts' | 'news';
  label: string;
  count: number;
  icon: string;
  description?: string;
}

export interface EnhancedFilterProps {
  tabs: FilterTab[];
  activeTab: 'all' | 'posts' | 'news';
  onTabChange: (tab: 'all' | 'posts' | 'news') => void;
  showSearch?: boolean;
  onSearchChange?: (query: string) => void;
}

const EnhancedFilter: React.FC<EnhancedFilterProps> = ({
  tabs,
  activeTab,
  onTabChange,
  showSearch = true,
  onSearchChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchChange?.(value);
  };

  return (
    <div className="filter-container bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.key
                    ? 'bg-white text-blue-500'
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      {showSearch && (
        <div className="relative">
          <input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            🔍
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedFilter;