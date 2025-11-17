// frontend/src/components/NewsForm.tsx
import "./NewsForm.css";
import toast from "react-hot-toast";
import { useState } from "react";

interface NewsFormProps {
  onSuccess: () => void;
}

const NewsForm: React.FC<NewsFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    description: '',
    source: '',
    link: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/mongo/news/insert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            ...formData,
            date: new Date().toISOString()
          }]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add news');
      }

      setSuccess(true);
      setFormData({ title: '', content: '', description: '', source: '', link: '' });
      onSuccess();
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add news');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="news-form-container">
      <div className="glass-card">
        <div className="form-header">
          <span className="title-icon">📰</span>
          <h3>Add MongoDB News</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title *
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter news title"
              className="glass-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="source" className="form-label">
              Source *
            </label>
            <input
              id="source"
              type="text"
              name="source"
              value={formData.source}
              onChange={handleChange}
              required
              placeholder="News source"
              className="glass-input"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="content" className="form-label">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={4}
              placeholder="Enter news content"
              className="glass-input"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              placeholder="Enter news description"
              className="glass-input"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="link" className="form-label">
              Link
            </label>
            <input
              id="link"
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://example.com"
              className="glass-input"
            />
          </div>

          {error && (
            <div className="form-group full-width">
              <div className="text-red-300 text-sm bg-red-500/20 p-3 rounded-lg border border-red-400/30">
                {error}
              </div>
            </div>
          )}

          {success && (
            <div className="form-group full-width">
              <div className="text-green-300 text-sm bg-green-500/20 p-3 rounded-lg border border-green-400/30">
                ✅ News added successfully!
              </div>
            </div>
          )}

          <div className="form-group full-width">
            <div className="form-actions">
              <button
                type="submit"
                disabled={loading}
                className={`gradient-btn ${loading ? 'loading' : ''}`}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Adding...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus-circle"></i>
                    Add News
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsForm;