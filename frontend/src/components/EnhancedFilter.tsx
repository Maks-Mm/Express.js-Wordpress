import { useCallback, useState, useEffect } from "react";
import './EnhancedFilter.css';

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
    <div className="enhanced-filter-container w-full">
      {/* Search Input - Borrowed from example */}
      {showSearch && (
        <div className="search-container">
          <input
            type="text"
            placeholder="Search filters..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
            spellCheck={false}
          />
        </div>
      )}

      {/* Enhanced Tab Navigation */}
      <div className="tabs-container">
        {displayTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key.toLowerCase() as 'all' | 'posts' | 'news')}
            className={`tab-button ${activeTab === tab.key ? 'tab-button--active' : 'tab-button--inactive'}`}
          >
            <span className="tab-icon">{tab.icon}</span>
            <div className="tab-content">
              <span className="tab-label">{tab.label}</span>
              <div className="tab-meta">
                <span className="tab-count">{tab.count}</span>
                {tab.description && (
                  <span className="tab-description">{tab.description}</span>
                )}
              </div>
            </div>
          </button>
        ))}


      </div>

      {/* Show More/Less Button - Borrowed from example */}
      {showSearch && searchTerm.length < 2 && tabs.length > startLength && (
        <div className="expand-button-container">
          <button
            onClick={toggleExpand}
            className="expand-button"
          >
            {isExpanded ? 'Show Less' : `Show More (+${tabs.length - startLength})`}
          </button>
        </div>
      )}
    </div>
  );
}