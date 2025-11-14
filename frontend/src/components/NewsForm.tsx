// frontend/src/components/NewsForm.tsx
import React, { useState } from "react";
import "./NewsForm.css";

interface NewsFormData {
  title: string;
  content: string;
  source: string;
  date: string;
}

interface NewsFormProps {
  onSuccess?: () => void;
}

const NewsForm: React.FC<NewsFormProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<NewsFormData>({
    title: "",
    content: "",
    source: "",
    date: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/mongo/news/insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [formData] }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ News inserted successfully!");
        // Reset form
        setFormData({
          title: "",
          content: "",
          source: "",
          date: "",
        });
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
    <div className="news-form-container">
      <form onSubmit={handleSubmit} className="glass-card">
        <div className="form-header">
          <i className="fas fa-newspaper title-icon"></i>
          <h3>Add MongoDB News (Test)</h3>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter news title"
              value={formData.title}
              onChange={handleChange}
              className="glass-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Source</label>
            <input
              type="text"
              name="source"
              placeholder="News source"
              value={formData.source}
              onChange={handleChange}
              className="glass-input"
              disabled={loading}
            />
          </div>

          <div className="form-group full-width">
            <label className="form-label">Content</label>
            <textarea
              name="content"
              placeholder="Enter news content"
              rows={4}
              value={formData.content}
              onChange={handleChange}
              className="glass-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group full-width">
            <label className="form-label">Date & Time</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="glass-input"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className={`btn-glass ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            <i className="fas fa-plus-circle"></i>
            {loading ? "Adding..." : "Add News"}
          </button>

        </div>
      </form>
    </div>
  );
};

export default NewsForm;