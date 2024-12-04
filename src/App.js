import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ShotClock from './shotClock/shotClock';

function App() {
    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);
    const [time, setTime] = useState(600);

    useEffect(() => {
        fetchScore();
        fetchTime();
        const interval = setInterval(() => {
            fetchScore();
            fetchTime();
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchScore = async () => {
        const response = await axios.get('/score');
        setHomeScore(response.data.home);
        setAwayScore(response.data.away);
    };

    const fetchTime = async () => {
        const response = await axios.get('/time');
        setTime(response.data.time);
    };

    const resetScores = async () => {
        await axios.post('/reset');
        fetchScore();
        fetchTime();
    };

    const startTimer = async () => {
        await axios.post('/start-timer');
    };

    const stopTimer = async () => {
        await axios.post('/stop-timer');
    };

    const addPoints = async (team, points) => {
        await axios.post('/score', { team, points });
        fetchScore();
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="App">
            <div className="scoreboard">
                <div className="team">
                    <h2>Home</h2>
                    <div>{homeScore}</div>
                    <button onClick={() => addPoints('home', 2)}>Add 2 Points</button>
                    <button onClick={() => addPoints('home', 3)}>Add 3 Points</button>
                </div>
                <div className="team">
                    <h2>Away</h2>
                    <div>{awayScore}</div>
                    <button onClick={() => addPoints('away', 2)}>Add 2 Points</button>
                    <button onClick={() => addPoints('away', 3)}>Add 3 Points</button>
                </div>
                <div className="timer">
                    <h2>Time</h2>
                    <div>{formatTime(time)}</div>
                    <ShotClock></ShotClock>
                </div>
                <div className="controls">
                    <button onClick={resetScores}>Reset</button>
                    <button onClick={startTimer}>Start Timer</button>
                    <button onClick={stopTimer}>Stop Timer</button>
                </div>
            </div>
        </div>
    );
}

export default App;
