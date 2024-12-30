import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Team from './team/Team';
// import ShotClock from './shotClock/ShotClock';

function App() {
    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);
    const [homeFouls, setHomeFouls] = useState(0);
    const [awayFouls, setAwayFouls] = useState(0);
    const [homeTimeOuts, setHomeTimeOuts] = useState(2);
    const [awayTimeOuts, setAwayTimeOuts] = useState(2);
    const [time, setTime] = useState(600000); // 60000 = 10 minutos
    const [shotClockTime, setShotClock] = useState(24000);
    const [timerRunning, setTimerRunning] = useState(false);
    const [period, setPeriod] = useState(1); // 60000 = 10 min
    const [posession, setPosession] = useState(null); // 60000 = 10 min
    const [homePosession, setHomePosession] = useState(null);
    const [awayPosession, setAwayPosession] = useState(null);

    useEffect(() => {
        fetchScore();
        fetchTime();
        fetchShotClock();
        fetchFouls();
        fetchTimeOuts();
        fetchPeriod();
        fetchPosession();
        const interval = setInterval(() => {
            fetchScore();
            fetchTime();
            fetchShotClock();
            fetchFouls();
            fetchTimeOuts();
            fetchPeriod();
            fetchPosession();
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchScore = async () => {
        const response = await axios.get('/score');
        setHomeScore(response.data.home);
        setAwayScore(response.data.away);
    };

    const fetchFouls = async () => {
        const response = await axios.get('/fouls');
        setHomeFouls(response.data.homeFouls);
        setAwayFouls(response.data.awayFouls);
    };

    const fetchTimeOuts = async () => {
        const response = await axios.get('/time-outs');
        setHomeTimeOuts(response.data.homeTimeOuts);
        setAwayTimeOuts(response.data.awayTimeOuts);
    };

    const fetchPeriod = async () => {
        const response = await axios.get('/period');
        setPeriod(response.data.period);
    };

    const fetchPosession = async () => {
        const response = await axios.get('/posession');
        setHomePosession(response.data.homePosession);
        setAwayPosession(response.data.awayPosession);
        if (response.data.homePosession === true){
            setPosession("<");
            setHomePosession("<");
            setAwayPosession(null);
        }else if (response.data.awayPosession === true){
            setPosession(">");
            setAwayPosession(">");
            setHomePosession(null);
        }
    };

    const fetchTime = async () => {
        const response = await axios.get('/time');
        setTime(response.data.time);
    };

    const resetScores = async () => {
        await axios.post('/reset');
        fetchScore();
        fetchTime();
        fetchShotClock();
        fetchFouls();
        fetchTimeOuts();
        fetchPeriod();
        fetchPosession();
    };

    const startTimer = async () => {
        await axios.post('/start-timer');
        startShotClock();
    };

    const stopTimer = async () => {
        await axios.post('/stop-timer');
        stopShotClock();
    };

    const addPoints = async (team, points) => {
        await axios.post('/score', { team, points });
        fetchScore();
    };

    const fetchShotClock = async () => {
        const response = await axios.get('/shot-clock');
        setShotClock(response.data.shotClockTime);
    };

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

    const newPeriod = async () => {
        await axios.post('/period');
        fetchPeriod();
    };

    const postPosession = async (team, posession) => {
        await axios.post('/posession', { team, posession });
        fetchPosession();
    };

    const postTimeOut = async (team, timeOut) => {
        await axios.post('/time-outs', { team, timeOut });
        fetchTimeOuts();
    };

    const postFouls = async (team, fouls) => {
        await axios.post('/fouls', { team, fouls });
        fetchFouls();
    };

    const formatTime = (timer, time) => {
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000); // Obtener segundos en el formato correcto
        const secondsdeci = time / 1000;
        if (timer === "timer"){
            if (time >= 10000){
                return `${minutes.toString().padStart(1, '0')}:${seconds.toString().padStart(2, '0')}`; // Asegurarse de que minutos tienen un carácter
            } else {
                return `${secondsdeci}`;
            }
        }else{
            if (time >= 3000){
                return `${seconds.toString().padStart(2, '0')}`;
            } else {
                return `${secondsdeci}`;
            }
        }
    };

    return (
        <div className="App">
            <div className="scoreboard">
                <h1>MADEKA SPORTS</h1>               
                <div className="timer">
                    <div className="score">{formatTime("timer", time)}</div>
                </div>
                <Team name='home' score={homeScore} controller={false} homeTeam={true} fouls={homeFouls} timeOuts={homeTimeOuts}></Team>              
                <div>
                    <div className="posession">{homePosession}</div>
                    <div className="period">{period}</div>
                    <div className="posession">{awayPosession}</div>
                </div>
                <Team name='away' score={awayScore} controller={false} homeTeam={false} fouls={awayFouls} timeOuts={awayTimeOuts}></Team>

                <div>
                    {/* <ShotClock controller={false}></ShotClock> */}
                    <div className="shot-clock">
                        <h2 className="score">{formatTime("shot-clock", shotClockTime)}</h2>
                    </div>
                </div>
                <h3>Powered by MDK SOLUTIONS</h3>    
            </div>
            <div className="controller">
            <h1>CONTROLLER</h1>
                <div className="timer">
                    <div className="score">{formatTime("timer", time)}</div>
                </div>
                <div className="controls">
                    <button onClick={startTimer}>Start Timer</button>
                    <button onClick={stopTimer}>Stop Timer</button>
                </div>
                <div className="controls">
                    <Team name='home' score={homeScore} addPoints={addPoints} controller={true} homeTeam={true} fouls={homeFouls} timeOuts={homeTimeOuts} postFouls={postFouls} postTimeOut={postTimeOut} postPosession={postPosession}></Team>              
                    <div>
                        <div className="posession">{homePosession}</div>
                        <div className="period">{period}</div>
                        <div className="posession">{awayPosession}</div>
                        <button onClick={newPeriod}>New</button>
                    </div>
                    <Team name='away' score={awayScore} addPoints={addPoints} controller={true} homeTeam={false} fouls={awayFouls} timeOuts={awayTimeOuts} postFouls={postFouls} postTimeOut={postTimeOut} postPosession={postPosession}></Team>
                    <div>
                        {/* <ShotClock controller={true}></ShotClock></div> */}
                        <div className="shot-clock">
                            <h2 className="score">{formatTime("shot-clock", shotClockTime)}</h2>
                            <div>
                            <button onClick={startShotClock}>Start</button>
                            <button onClick={stopShotClock}>Stop</button>
                            <button onClick={resetShotClock}>Reset 24</button>
                            <button onClick={resetShotClockShort}>Reset 14</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div><button onClick={resetScores}>Reset</button></div>
            </div>
        </div>
    );
}

export default App;
