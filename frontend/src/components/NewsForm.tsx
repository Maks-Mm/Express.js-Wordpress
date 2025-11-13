// frontend/src/components/NewsForm.tsximport React, { useState } from "react";

import { useState } from "react";

interface NewsFormProps {
  onSuccess?: () => void; // optional callback after successful insert
}

const NewsForm: React.FC<NewsFormProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const content = (form.elements.namedItem("content") as HTMLInputElement).value;
    const source = (form.elements.namedItem("source") as HTMLInputElement).value;
    const date = (form.elements.namedItem("date") as HTMLInputElement).value;

    try {
      const res = await fetch("http://localhost:5000/api/mongo/news/insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ title, content, source, date }],
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ News inserted successfully!");
        form.reset();
        if (onSuccess) onSuccess();
      } else {
        console.error("❌ Server error:", data);
        alert(`❌ Failed to insert news: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("⚠️ Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded-lg">
      <table className="w-full table-auto border-collapse">
        <tbody>
          <tr className="border-b">
            <td className="px-3 py-2 font-medium text-gray-700 w-32">Title</td>
            <td className="px-3 py-2">
              <input
                type="text"
                name="title"
                placeholder="Enter news title"
                className="w-full border p-2 rounded"
                required
              />
            </td>
          </tr>
          <tr className="border-b">
            <td className="px-3 py-2 font-medium text-gray-700">Source</td>
            <td className="px-3 py-2">
              <input
                type="text"
                name="source"
                placeholder="News source"
                className="w-full border p-2 rounded"
              />
            </td>
          </tr>
          <tr className="border-b">
            <td className="px-3 py-2 font-medium text-gray-700 align-top">Content</td>
            <td className="px-3 py-2">
              <textarea
                name="content"
                placeholder="Enter news content"
                rows={4}
                className="w-full border p-2 rounded resize-none"
                required
              />
            </td>
          </tr>
          <tr>
            <td className="px-3 py-2 font-medium text-gray-700">Date & Time</td>
            <td className="px-3 py-2">
              <input
                type="datetime-local"
                name="date"
                className="w-full border p-2 rounded"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-4 text-right">
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add News Content"}
        </button>
      </div>
    </form>
  );
};

export default NewsForm;
