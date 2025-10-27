// components/AnimatedBackground.tsx
import { useEffect, useState } from 'react';

export default function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [timestamp] = useState(Date.now()); // Cache busting timestamp

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const backgroundStyle = {
    backgroundImage: `
      linear-gradient(135deg, #1e1633 0%, #2d1b69 50%, #1e1633 100%),
      url('https://dortmund-kreativ.de/wp-content/uploads/2022/04/01_Dortmunder_U_bestes_Foto_ever_web_Roland_Gorecki.jpg?v=${timestamp}')
    `,
    backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
    backgroundBlendMode: 'overlay' as const,
    backgroundSize: 'cover, 120%',
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    filter: 'brightness(0.8) contrast(1.1)',
  };

  return (
    <div 
      className="animated-background"
      style={backgroundStyle}
    />
  );
}