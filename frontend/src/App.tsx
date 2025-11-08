// frontend/src/App.tsx
import './App.css';
import './styles/wordpress.css'; // ✅ must come AFTER App.css and Tailwind
import Posts from './components/Posts';
import AnimatedBackground from './components/AnimatedBackground';

function App() {
  return (
    <div className="app-container">
      <AnimatedBackground />
      <div className="content-wrapper">
        <Posts />
      </div>
    </div>
  );
}

export default App;
