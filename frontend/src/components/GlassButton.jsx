// GlassButton.jsx
export default function GlassButton({ label = "Add News", onClick }) {
  return (
    <button
      className="glass-btn"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
