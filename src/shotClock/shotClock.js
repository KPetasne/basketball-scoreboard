import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ShotClock.css'

const ShotClock = ({ shotClockTime, fetchShotClock, timer, controller }) => {  
    const LONG_SHOTCLOCK = 24000;
    const SHORT_SHOTCLOCK = 14000;
    const ONE_SECOND = 1000;
    const INTERVAL_MS = 100;
    const [timerRunning, setTimerRunning] = useState(false);

    useEffect(() => {
        fetchShotClock;
        const interval = setInterval(() => {
            fetchShotClock;
        }, INTERVAL_MS); // cada una decima de segundo actualiza la informacion
        return () => clearInterval(interval);
    }, [fetchShotClock]);

    const startShotClock = async () => {
        await axios.post('/start-shot-clock');
        setTimerRunning(true);
    };

    const stopShotClock = async () => {
        await axios.post('/stop-shot-clock');
        setTimerRunning(false);
    };

    const resetShotClock = async () => {
        await axios.post('/reset-shot-clock');
    };

    const resetShotClockShort = async () => {
        await axios.post('/reset-shot-clock-short');
    };

    const formatTime = (timer, time) => {
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000); // Obtener segundos en el formato correcto
        const secondsdeci = (time / 1000).toFixed(1);
        if (timer === "timer"){
            if (time >= 60000){
                return `${minutes.toString().padStart(1, '0')}:${seconds.toString().padStart(2, '0')}`; // Asegurarse de que minutos tienen un carácter
            } else {
                return `${secondsdeci}`;
            }
        }else{
            if (time >= 5000){
                return `${seconds.toString().padStart(2, '0')}`;
            } else if (time >= 0){
                return `${secondsdeci}`;
            } else {
                return ".";
            }
        }
    };

    if (controller) {
    return (
        <div className="timer-shot-clock">
            <div className="timer">{formatTime("timer", timer)}</div>
            <div className="shot-clock">{formatTime("shot-clock", shotClockTime)}</div>
            <div className="controls">
                <button onClick={startShotClock}>Start</button>
                <button onClick={stopShotClock}>Stop</button>
                <button onClick={resetShotClock}>Reset 24</button>
                <button onClick={resetShotClockShort}>Reset 14</button>
            </div>
        </div>
    );
    }else{
    return (
        <div className="timer-shot-clock">
            <div className="timer">{formatTime("timer", timer)}</div>
            <div className="shot-clock">{formatTime("shot-clock", shotClockTime)}</div>
        </div>
    );
    }
};

export default ShotClock;
