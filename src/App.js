import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Team from './team/Team';
import ShotClock from './shotClock/ShotClock';

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

                <Team name='home' score={homeScore} addPoints={addPoints}></Team>
                <ShotClock></ShotClock>
                <Team name='away' score={awayScore} addPoints={addPoints}></Team>

                <div className="timer">
                    <h2>Time</h2>
                    <div className="score">{formatTime(time)}</div>
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
