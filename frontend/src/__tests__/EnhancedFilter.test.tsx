// frontend/src/_tests/EnhancedFilter.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import EnhancedFilter from '../components/EnhancedFilter';

// Mock data for testing
const mockTabs = [
  { key: 'all' as const, label: 'All Content', count: 10, icon: '📁', description: 'All types of content' },
  { key: 'posts' as const, label: 'Posts', count: 7, icon: '📝', description: 'Blog posts and articles' },
  { key: 'news' as const, label: 'News', count: 3, icon: '📰', description: 'News updates' },
];

const mockOnTabChange = jest.fn();

describe('EnhancedFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all tabs when not expanded', () => {
    render(
      <EnhancedFilter
        tabs={mockTabs}
        activeTab="all"
        onTabChange={mockOnTabChange}
        showSearch={true}
        startLength={3}
      />
    );

    expect(screen.getByText('All Content')).toBeInTheDocument();
    expect(screen.getByText('Posts')).toBeInTheDocument();
    expect(screen.getByText('News')).toBeInTheDocument();
  });

  it('calls onTabChange when a tab is clicked', () => {
    render(
      <EnhancedFilter
        tabs={mockTabs}
        activeTab="all"
        onTabChange={mockOnTabChange}
      />
    );

    fireEvent.click(screen.getByText('Posts'));
    expect(mockOnTabChange).toHaveBeenCalledWith('posts');
  });

  it('shows search input when showSearch is true', () => {
    render(
      <EnhancedFilter
        tabs={mockTabs}
        activeTab="all"
        onTabChange={mockOnTabChange}
        showSearch={true}
      />
    );

    expect(screen.getByPlaceholderText('Search filters...')).toBeInTheDocument();
  });

  it('does not show search input when showSearch is false', () => {
    render(
      <EnhancedFilter
        tabs={mockTabs}
        activeTab="all"
        onTabChange={mockOnTabChange}
        showSearch={false}
      />
    );

    expect(screen.queryByPlaceholderText('Search filters...')).not.toBeInTheDocument();
  });
});