import React, { useState, useEffect } from 'react';
import './ShotClock.css'

const ShotClock = () => {
  const [shotClock, setShotClock] = useState(24);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (timerRunning && shotClock > 0) {
      timer = setInterval(() => {
        setShotClock(prevShotClock => prevShotClock - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerRunning, shotClock]);

  const resetShotClock = () => {
    setShotClock(24);
    setTimerRunning(false);
  };

  useEffect(() => {
    if (shotClock === 0) {
      setTimerRunning(false);
    }
  }, [shotClock]);

  return (
    <div className="shot-clock">
      <h2 className="score">{shotClock}</h2>
      <button onClick={() => setTimerRunning(true)}>Start</button>
      <button onClick={() => setTimerRunning(false)}>Stop</button>
      <button onClick={resetShotClock}>Reset</button>
    </div>
  );
};

export default ShotClock;
