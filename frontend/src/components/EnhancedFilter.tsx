import { useCallback, useState, useEffect } from "react";

interface FilterTab {
  key: 'all' | 'posts' | 'news';
  label: string;
  count: number;
  icon: string;
  description?: string;
}

interface EnhancedFilterProps {
  tabs: FilterTab[];
  activeTab: string;
  onTabChange: (tab: FilterTab['key']) => void;
  showSearch?: boolean;
  startLength?: number;
}

export default function EnhancedFilter({ 
  tabs, 
  activeTab, 
  onTabChange,
  showSearch = false,
  startLength = 3
}: EnhancedFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTabs, setFilteredTabs] = useState(tabs);

  // Search functionality borrowed from the example
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (value.length < 2) {
      setFilteredTabs(tabs);
    } else {
      setFilteredTabs(
        tabs.filter(tab => 
          tab.label.toLowerCase().includes(value) ||
          tab.description?.toLowerCase().includes(value)
        )
      );
    }
  }, [tabs]);

  // Expand/collapse functionality
  const toggleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  // Reset expansion when search is cleared
  useEffect(() => {
    if (searchTerm.length < 2) {
      setFilteredTabs(tabs);
    }
  }, [searchTerm, tabs]);

  const displayTabs = searchTerm.length >= 2 ? filteredTabs : 
    (isExpanded ? filteredTabs : filteredTabs.slice(0, startLength));

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Search Input - Borrowed from example */}
      {showSearch && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search filters..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm"
            spellCheck={false}
          />
        </div>
      )}

      {/* Enhanced Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        {displayTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`
              px-5 py-4 rounded-xl text-sm font-medium 
              flex items-center gap-3 transition-all duration-300 
              border min-w-[140px] backdrop-blur-sm
              ${
                activeTab === tab.key 
                  ? 'bg-white/30 border-white/60 shadow-lg shadow-white/20' 
                  : 'bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/50'
              }
            `}
            style={{
              color: 'white',
              backgroundColor: 'transparent',
            }}
          >
            <span className="text-lg">{tab.icon}</span>
            <div className="flex flex-col items-start flex-1">
              <span className="text-sm font-semibold whitespace-nowrap">
                {tab.label}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold px-2 py-1 bg-white/20 rounded-full">
                  {tab.count}
                </span>
                {tab.description && (
                  <span className="text-[10px] opacity-80 max-w-[80px] truncate">
                    {tab.description}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Show More/Less Button - Borrowed from example */}
      {showSearch && searchTerm.length < 2 && tabs.length > startLength && (
        <div className="text-center mt-4">
          <button
            onClick={toggleExpand}
            className="px-6 py-2 bg-white/20 hover:bg-white/30 border border-white/30 rounded-full text-white text-sm font-medium transition-all duration-200 backdrop-blur-sm"
          >
            {isExpanded ? 'Show Less' : `Show More (+${tabs.length - startLength})`}
          </button>
        </div>
      )}
    </div>
  );
}