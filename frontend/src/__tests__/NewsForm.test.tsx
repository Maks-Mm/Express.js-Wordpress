// frontend/src/__tests__/NewsForm.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NewsForm from "../components/NewsForm";

const mockOnSuccess = jest.fn();

beforeEach(() => {
  (global.fetch as jest.Mock).mockClear();
  mockOnSuccess.mockClear();
});

test("renders news form with all fields", () => {
  render(<NewsForm onSuccess={mockOnSuccess} />);
  
  expect(screen.getByText(/Add MongoDB News/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /add news/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/source/i)).toBeInTheDocument();
});

test("submits form successfully", async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ success: true, count: 1 })
  });

  render(<NewsForm onSuccess={mockOnSuccess} />);

  const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
  const contentInput = screen.getByLabelText(/content/i) as HTMLTextAreaElement;
  const sourceInput = screen.getByLabelText(/source/i) as HTMLInputElement;

  fireEvent.change(titleInput, {
    target: { value: "Test News Title" }
  });
  fireEvent.change(contentInput, {
    target: { value: "Test news content" }
  });
  fireEvent.change(sourceInput, {
    target: { value: "Test Source" }
  });

  fireEvent.click(screen.getByRole('button', { name: /add news/i }));

  await waitFor(() => {
    expect(mockOnSuccess).toHaveBeenCalled();
  });
});

test("shows error on form submission failure", async () => {
  (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

  render(<NewsForm onSuccess={mockOnSuccess} />);

  const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
  const sourceInput = screen.getByLabelText(/source/i) as HTMLInputElement;

  fireEvent.change(titleInput, {
    target: { value: "Test News" }
  });
  fireEvent.change(sourceInput, {
    target: { value: "Test Source" }
  });

  fireEvent.click(screen.getByRole('button', { name: /add news/i }));

  // Check for either error message
  await waitFor(() => {
    const errorMessage = screen.queryByText(/failed to add news/i) || screen.queryByText(/API Error/i);
    expect(errorMessage).toBeInTheDocument();
  });
});