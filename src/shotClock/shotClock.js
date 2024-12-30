import React, { useState, useEffect } from 'react';
import './ShotClock.css'

function ShotClock ({controller}){
  const [shotClockTime, setShotClock] = useState(24);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (timerRunning && shotClockTime > 0) {
      timer = setInterval(() => {
        setShotClock(prevShotClock => prevShotClock - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerRunning, shotClockTime]);

  const resetShotClock = () => {
    setShotClock(24);
    setTimerRunning(false);
  };

  useEffect(() => {
    if (shotClockTime === 0) {
      setTimerRunning(false);
    }
  }, [shotClockTime]);

  if (controller == true) {
    return (
      <div className="shot-clock">
        <h2 className="score">{shotClockTime}</h2>
        <div>
          <button onClick={() => setTimerRunning(true)}>Start</button>
          <button onClick={() => setTimerRunning(false)}>Stop</button>
          <button onClick={resetShotClock}>Reset 24</button>
          <button onClick={resetShotClock}>Reset 14</button>
        </div>
      </div>
    );
  }else{
    return (
      <div className="shot-clock">
        <h2 className="score">{shotClockTime}</h2>
      </div>
    );
  }
};

export default ShotClock;
