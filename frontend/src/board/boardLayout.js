// BoardLayout.jsx
import React from 'react';

export default function BoardLayout({ mode, onExitAd = () => {}, children }) {
  return (
    <>
      {mode === 'output' && (
        <div className="board-output">
          <div className="board-container">{children}</div>
        </div>
      )}

      {mode === 'overlay' && (
        <div className="board-overlay">
          <div className="board-container">{children}</div>
        </div>
      )}

      {mode === 'ads' && (
        <div className="board-ads">
          <div className="ads-content">
            <img src="/adsponsor.png" alt="Sponsor" className="ads-logo" />
            <h1 className="ads-message">¡Tiempo fuera patrocinado por MDK Solutions!</h1>
            <button className="ads-close" onClick={onExitAd}>✖</button>
          </div>
        </div>
      )}
    </>
  );
}
