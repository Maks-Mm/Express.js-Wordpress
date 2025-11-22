//frontend/src/components/GlassButton.jsx
// GlassButton.jsx
export default function GlassButton({
  label = "Add News",
  onClick,
  type = "button",
}) {
  return (
    <>
      <style jsx>{`
        .glass-btn {
          padding: 14px 40px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          font-size: 18px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(255, 255, 255, 0.1);
        }

        .glass-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
          transform: translateY(-3px);
        }

        .glass-btn:active {
          transform: translateY(0);
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.15);
        }
      `}</style>

      <button type={type} className="glass-btn" onClick={onClick}>
        {label}
      </button>
    </>
  );
}
