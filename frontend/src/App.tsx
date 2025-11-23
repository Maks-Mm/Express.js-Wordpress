// frontend/src/App.tsx
import './App.css';
import './styles/wordpress.css'; // ✅ must come AFTER App.css and Tailwind
import Posts from './components/Posts';
import AnimatedBackground from './components/AnimatedBackground';
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="app-container font-poppins">  {/* 👈 use the font */}
      <AnimatedBackground />

      <Toaster position="top-right" />
      <div className="content-wrapper">
        <Posts />
      </div>
    </div>
  );
}

export default App;
