import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ShotClock.css'
import { LONG_SHOTCLOCK, SHORT_SHOTCLOCK, ONE_MINUTE, ONE_SECOND, FIVE_SECOND, INTERVAL_MS } from '../gameConstants';

const ShotClock = ({ shotClockTime, fetchShotClock, timer, controller }) => {  
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
        await axios.post('/stop-timer');
        setTimerRunning(false);
    };

    const resetShotClock = async (shotclock) => {
        await axios.post('/reset-shot-clock', {shotclock} );
    };

    // const resetShotClockShort = async () => {
    //     await axios.post('/reset-shot-clock-short');
    // };

    const formatTime = (timer, time) => {
        const minutes = Math.floor(time / ONE_MINUTE);
        const seconds = Math.floor((time % ONE_MINUTE) / ONE_SECOND); // Obtener segundos en el formato correcto
        const secondsdeci = (time / ONE_SECOND).toFixed(1);
        if (timer === "timer"){
            if (time >= ONE_MINUTE){
                return `${minutes.toString().padStart(1, '0')}:${seconds.toString().padStart(2, '0')}`; // Asegurarse de que minutos tienen un carácter
            } else {
                return `${secondsdeci}`;
            }
        }else{
            if (time >= FIVE_SECOND){
                return `${seconds.toString().padStart(2, '0')}`;
            } else if (time >= 0){
                return `${secondsdeci}`;
            } else {
                return ".";
            }
        }
    };
    return (
        <div className="timer-shot-clock">
            <div className="timer-shot-clock-timer">
                <div className="timer">{formatTime("timer", timer)}</div>
                <div className="shot-clock">{formatTime("shot-clock", shotClockTime)}</div>
            </div>
            {controller === true && (
                <div className="controls">
                    <button onClick={startShotClock}>Start</button>
                    <button onClick={stopShotClock}>Stop</button>
                    <button onClick={() => resetShotClock(LONG_SHOTCLOCK)}>Reset {formatTime("shot-clock",LONG_SHOTCLOCK)}</button>
                    <button onClick={() => resetShotClock(SHORT_SHOTCLOCK)}>Reset {formatTime("shot-clock",SHORT_SHOTCLOCK)}</button>
                </div>
            )}
        </div>
    );
};

export default ShotClock;
