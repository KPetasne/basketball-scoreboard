import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Team from './team/Team';
import ShotClock from './shotClock/shotClock.js';
import {LoginButton,LogoutButton,Profile} from './log/log.js';

import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
const domain = process.env.REACT_APP_AUTH0_DOMAIN || "dev-u3c555b5wr3ui240.us.auth0.com"; 
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID || "ABoNb46j1b4TRkNsuSK74tZEDQB9zlmn";


function App() {
    const { isAuthenticated, isLoading } = useAuth0(); if (isLoading) { return <div>Loading ...</div>; }
    const TEN_MINUTES = 600000;
    const ONE_SECOND = 1000;
    const INTERVAL_MS = 100;
    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);
    const [homeFouls, setHomeFouls] = useState(0);
    const [awayFouls, setAwayFouls] = useState(0);
    const [homeTimeOuts, setHomeTimeOuts] = useState(2);
    const [awayTimeOuts, setAwayTimeOuts] = useState(2);
    const [time, setTime] = useState(TEN_MINUTES); // 600000 = 10 minutos
    const [shotClockTime, setShotClock] = useState(24000);
    const [period, setPeriod] = useState(1);
    const [posession, setPosession] = useState(null); 
    const [homePosession, setHomePosession] = useState(null);
    const [awayPosession, setAwayPosession] = useState(null);
    const [board, setBoard] = useState(0);

    useEffect(() => {
        const fetchAllData = async () => {
            await fetchScore();
            await fetchTime();
            await fetchShotClock();
            await fetchFouls();
            await fetchTimeOuts();
            await fetchPeriod();
            await fetchPosession();
        };
        const interval = setInterval(() => {
            fetchAllData();
        }, INTERVAL_MS); // cada una decima de segundo actualiza la informacion
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

    const fetchShotClock = async () => {
        const response = await axios.get('/shot-clock');
        setShotClock(response.data.shotClockTime);
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
        const secondsdeci = (time / 1000).toFixed(1);
        if (timer === "timer"){
            if (time >= 60000){
                return `${minutes.toString().padStart(1, '0')}:${seconds.toString().padStart(2, '0')}`; // Asegurarse de que minutos tienen un carácter
            } else {
                return `${secondsdeci}`;
            }
        }
    };

    // const boardType = (b) => {
    //     setBoard("board-"+b);
    // }

    return (

        <div className="App">
            {!isAuthenticated ? ( 
                <LoginButton /> 
            ) : ( 
                <> 
                    <LogoutButton /> 
                    <Profile />
                    {/* <button onClick={boardType(1)}>Board 1</button>
                    <button onClick={boardType(2)}>Board 2</button> */}
                    <div className="board {board}">
                        <div className='title'>MADEKA SPORTS</div>
                        <div className="scoreboard">
                            <Team name='home' score={homeScore} controller={false} homeTeam={true} fouls={homeFouls} timeOuts={homeTimeOuts}></Team>  
                            <div className="match">
                                <div className="match-timer">
                                    <div className="timer">{formatTime("timer", time)}</div>
                                </div>
                                <div className="perpo">
                                    <div className="posession">{homePosession}</div>
                                    <div className="period">{period}</div>
                                    <div className="posession">{awayPosession}</div>
                                </div>
                            </div>
                            <Team name='away' score={awayScore} controller={false} homeTeam={false} fouls={awayFouls} timeOuts={awayTimeOuts}></Team>
                        </div>
                        <div className='sign'>Powered by MDK SOLUTIONS</div>
                    </div>
                    <div className="board">
                        <ShotClock name='shot-clock'                         
                            shotClockTime={shotClockTime}
                            timer={time} 
                            controller={false}
                        />
                    </div>
                    <div className="controller">
                        <div className='title'>CONTROLLER</div>
                        <div className="scoreboard">
                            <Team name='home' score={homeScore} addPoints={addPoints} controller={true} homeTeam={true} fouls={homeFouls} timeOuts={homeTimeOuts} postFouls={postFouls} postTimeOut={postTimeOut} postPosession={postPosession}></Team>          
                            <div className="match">
                                <div className="match-timer">
                                    <div className="timer">{formatTime("timer", time)}</div>
                                </div>
                                <div className="controls">
                                    <button onClick={startTimer}>Start Timer</button>
                                    <button onClick={stopTimer}>Stop Timer</button>
                                </div>
                                <div className="perpo">
                                    <div className="posession">{homePosession}</div>
                                    <div className="period">{period}</div>
                                    <div className="posession">{awayPosession}</div>
                                </div>
                                <div className="controls">
                                    <button onClick={newPeriod}>New</button>
                                </div>
                                <ShotClock
                                    shotClockTime={shotClockTime} 
                                    timer={time}
                                    controller={true}
                                />
                            </div>
                            <Team name='away' score={awayScore} addPoints={addPoints} controller={true} homeTeam={false} fouls={awayFouls} timeOuts={awayTimeOuts} postFouls={postFouls} postTimeOut={postTimeOut} postPosession={postPosession}></Team>
                        </div>
                        <div className='controls'><button onClick={resetScores}>Reset</button></div>
                        <div className='sign'>Powered by MDK SOLUTIONS</div>
                    </div>
                </> 
            )}
        </div>
    );
}
const Auth0App = () => ( <Auth0Provider domain={domain} clientId={clientId} authorizationParams={{ redirect_uri: window.location.origin }} > <App /> </Auth0Provider> ); 

export default Auth0App;
