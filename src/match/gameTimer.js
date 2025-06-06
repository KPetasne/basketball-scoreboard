import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GameTimer = ({ controller, time, fetchTime }) => {  
    const ONE_MINUTE = 60000;
    const ONE_SECOND = 1000;
    const INTERVAL_MS = 100;
    const [timer, setTime] = useState(false);

    useEffect(() => {
        fetchTime;
        const interval = setInterval(() => {
            fetchTime;
        }, INTERVAL_MS); // cada una decima de segundo actualiza la informacion
        return () => clearInterval(interval);
    }, [fetchTime]);

    const startTimer = async () => {
        await axios.post('/start-timer');
        await axios.post('/start-shot-clock');
    };

    const stopTimer = async () => {
        await axios.post('/stop-timer');
        await axios.post('/stop-shot-clock');
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / ONE_MINUTE);
        const seconds = Math.floor((time % ONE_MINUTE) / ONE_SECOND); // Obtener segundos en el formato correcto
        const secondsdeci = (time / ONE_SECOND).toFixed(1);
        if (time >= ONE_MINUTE){
            return `${minutes.toString().padStart(1, '0')}:${seconds.toString().padStart(2, '0')}`; // Asegurarse de que minutos tienen un carácter
        } else {
            return `${secondsdeci}`;
        }
    };
    return (
        <div className="match-timer">
            <div className="timer">{formatTime(time)}</div>
            {controller === true && (
                <div className="controls">
                    <button onClick={startTimer}>Start Timer</button>
                    <button onClick={stopTimer}>Stop Timer</button>
                </div>
            )}
        </div>
    );
};

export default GameTimer;
