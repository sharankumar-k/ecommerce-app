import React, { useEffect } from "react";

const AnimatedBackground = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, sans-serif;
        background: linear-gradient(
          135deg,
          #f9fafc 0%,
          #e6f0fa 35%,
          #d9e8f5 60%,
          #f5f7fa 100%
        );
        background-size: 400% 400%;
        animation: subtleGradient 18s ease infinite;
        color: #212121;
        overflow-x: hidden;
        transition: background 0.5s ease;
      }

      @keyframes subtleGradient {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }

      /* 🌫️ Soft light overlays for premium depth */
      body::before {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        background: radial-gradient(
            circle at top left,
            rgba(255, 255, 255, 0.65),
            transparent 70%
          ),
          radial-gradient(
            circle at bottom right,
            rgba(210, 225, 240, 0.4),
            transparent 70%
          ),
          radial-gradient(
            circle at center,
            rgba(230, 235, 245, 0.2),
            transparent 60%
          );
        z-index: -1;
      }

      /* Optional: subtle fade-in effect on page load */
      html, body {
        opacity: 0;
        animation: fadeInSmooth 1.2s ease forwards;
      }

      @keyframes fadeInSmooth {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return null;
};

export default AnimatedBackground;
