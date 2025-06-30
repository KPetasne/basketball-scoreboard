import { useRef, useEffect, useState } from 'react';

export default function DraggableShotClock({ children }) {
  const shotClockRef = useRef(null);
  const [pos, setPos] = useState({
    x: window.innerWidth / 2 - 100,
    y: 80
});

  useEffect(() => {
    const el = shotClockRef.current;
    if (!el) return;

    const handleMouseDown = (e) => {
      const offsetX = e.clientX - el.getBoundingClientRect().left;
      const offsetY = e.clientY - el.getBoundingClientRect().top;

      const handleMouseMove = (e) => {
        setPos({ x: e.clientX - offsetX, y: e.clientY - offsetY });
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    el.addEventListener("mousedown", handleMouseDown);
    return () => el.removeEventListener("mousedown", handleMouseDown);
  }, []);

  return (
    <div
      ref={shotClockRef}
      className="shotclock-popup"
      style={{ top: pos.y, left: pos.x, position: 'absolute' }}
    >
      {children}
    </div>
  );
}
