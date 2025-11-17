import { render, screen, waitFor } from "@testing-library/react";
import Posts from "../components/Posts";

// Mock the components that Posts imports
jest.mock("../components/EnhancedFilter", () => {
  return function MockEnhancedFilter({ tabs, activeTab, onTabChange }: any) {
    return (
      <div data-testid="enhanced-filter">
        {tabs.map((tab: any) => (
          <button 
            key={tab.key} 
            onClick={() => onTabChange(tab.key)}
            data-testid={`tab-${tab.key}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  };
});

jest.mock("../components/NewsForm", () => {
  return function MockNewsForm({ onSuccess }: any) {
    return <div data-testid="news-form">News Form</div>;
  };
});

jest.mock("../components/NewsInsertChart", () => {
  return function MockNewsInsertChart({ newsItems }: any) {
    return <div data-testid="news-chart">News Chart</div>;
  };
});

// Mock AOS globally
jest.mock('aos', () => ({
  init: jest.fn(),
  refresh: jest.fn()
}));

global.fetch = jest.fn();

const mockPosts = [
  {
    id: "wp-1",
    title: { rendered: "Test WordPress Post" },
    content: { rendered: "<p>Test content</p>" },
    excerpt: { rendered: "Test excerpt" },
    date: "2023-10-01T00:00:00Z",
    slug: "test-post",
    type: "wp" as const,
    link: "http://test.com"
  },
  {
    id: "mongo-1", 
    title: { rendered: "Test MongoDB News" },
    content: { rendered: "Test news content" },
    excerpt: { rendered: "Test news excerpt" },
    date: "2023-10-02T00:00:00Z",
    slug: "test-news",
    type: "news" as const,
    source: "Test Source",
    link: "http://news.com"
  }
];

beforeEach(() => {
  (global.fetch as jest.Mock).mockClear();
});

// Suppress act warnings for this test file
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

test("renders loading state initially", () => {
  render(<Posts />);
  expect(screen.getByText(/Loading content/i)).toBeInTheDocument();
});

test("renders error state when fetch fails", async () => {
  (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("API Error"));
  
  render(<Posts />);
  
  await waitFor(() => {
    expect(screen.getByText(/API Error/i)).toBeInTheDocument();
  });
});

test("renders content after successful fetch", async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => mockPosts
  });

  render(<Posts />);

  await waitFor(() => {
    expect(screen.getByText(/Dortmund News Hub/i)).toBeInTheDocument();
  });
  
  // Use queryAllByText instead of getAllByText
  const postTitles = screen.queryAllByText("Test WordPress Post");
  expect(postTitles.length).toBeGreaterThan(0);
  
  const newsTitles = screen.queryAllByText("Test MongoDB News");
  expect(newsTitles.length).toBeGreaterThan(0);
});