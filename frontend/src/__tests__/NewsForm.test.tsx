import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewsForm from '../components/NewsForm';

// Mock fetch globally
global.fetch = jest.fn();

const mockOnSuccess = jest.fn();

beforeEach(() => {
  (global.fetch as jest.Mock).mockClear();
  mockOnSuccess.mockClear();
});

describe('NewsForm', () => {
  it('renders news form with all fields', () => {
    render(<NewsForm onSuccess={mockOnSuccess} />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/source/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/link/i)).toBeInTheDocument();
    // Fix: Look for "Add News" button text instead of "submit"
    expect(screen.getByRole('button', { name: /add news/i })).toBeInTheDocument();
  });

  it('submits form successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Success' })
    });

    render(<NewsForm onSuccess={mockOnSuccess} />);
    
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: 'Test Content' } });
    fireEvent.change(screen.getByLabelText(/source/i), { target: { value: 'Test Source' } });
    
    // Fix: Use the correct button text
    fireEvent.click(screen.getByRole('button', { name: /add news/i }));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('shows error on form submission failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Failed to add news' })
    });

    render(<NewsForm onSuccess={mockOnSuccess} />);
    
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: 'Test Content' } });
    fireEvent.change(screen.getByLabelText(/source/i), { target: { value: 'Test Source' } });
    
    // Fix: Use the correct button text
    fireEvent.click(screen.getByRole('button', { name: /add news/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to add news/i)).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    render(<NewsForm onSuccess={mockOnSuccess} />);
    
    // Try to submit without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /add news/i }));

    // The form should prevent submission and show validation errors
    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });
});