// src/components/AnimatedBackground.js
import { useEffect } from "react";

const AnimatedBackground = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      body {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
        background: linear-gradient(135deg, #e3f2fd, #bbdefb, #e0f7fa);
        background-size: 200% 200%;
        animation: smoothFlow 18s ease-in-out infinite;
        font-family: 'Inter', sans-serif;
        transition: background 0.5s ease;
      }

      @keyframes smoothFlow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      /* Subtle overlay for soft depth */
      body::before {
        content: '';
        position: fixed;
        inset: 0;
        background: radial-gradient(
          circle at 20% 20%, 
          rgba(255, 255, 255, 0.3),
          rgba(255, 255, 255, 0.1) 60%
        );
        z-index: -1;
      }

      /* Frosted look for content areas */
      .home-container, .main-content {
        background: rgba(255, 255, 255, 0.65);
        backdrop-filter: blur(12px);
        border-radius: 12px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return null;
};

export default AnimatedBackground;
