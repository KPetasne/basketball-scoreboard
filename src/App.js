import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Team from './match/team/Team.js';
import ShotClock from './match/shotClock/shotClock.js';
import GameTimer from './match/gameTimer.js';
import GamePeriod from './match/gamePeriod.js';
import GamePosession from './match/gamePosession.js';
import { TEN_MINUTES, ONE_MINUTE,LONG_SHOTCLOCK,SHORT_SHOTCLOCK, FIVE_SECOND,ONE_SECOND,INTERVAL_MS } from './match/gameConstants.js';
import {LoginButton,LogoutButton,Profile} from './log/log.js';

import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
const domain = process.env.REACT_APP_AUTH0_DOMAIN || "dev-u3c555b5wr3ui240.us.auth0.com"; 
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID || "ABoNb46j1b4TRkNsuSK74tZEDQB9zlmn";


function App() {
    const { isAuthenticated, isLoading } = useAuth0(); if (isLoading) { return <div>Loading ...</div>; }
    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);
    const [homeFouls, setHomeFouls] = useState(0);
    const [awayFouls, setAwayFouls] = useState(0);
    const [homeTimeOuts, setHomeTimeOuts] = useState(2);
    const [awayTimeOuts, setAwayTimeOuts] = useState(2);
    const [time, setTime] = useState(TEN_MINUTES); // 600000 = 10 minutos
    const [shotClockTime, setShotClock] = useState(LONG_SHOTCLOCK);
    const [period, setPeriod] = useState(1);
    const [posession, setPosession] = useState(null); 
    const [homePosession, setHomePosession] = useState(null);
    const [awayPosession, setAwayPosession] = useState(null);
    const [board, setBoard] = useState(1);
    const [boardTeam, setBoardTeam] = useState(1);

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

    const fetchShotClock = async () => {
        const response = await axios.get('/shot-clock');
        setShotClock(response.data.shotClockTime);
    };

    const handleBoardChange = (event) => {
        setBoard(parseInt(event.target.value));
    };

    const handleBoardTeamChange = (event) => {
        setBoardTeam(event.target.value);
    };

    return (

        <div className="App">
            {/* Dropdown to select board type */}
            <div className="board-selector">
                <label htmlFor="board-type">Select Board Format:</label>
                <select id="board-type" value={board} onChange={handleBoardChange}>
                    <option value="1">Format 1 - Scoreboard</option>
                    <option value="2">Format 2 - Statistics</option>
                    <option value="3">Format 3 - Team</option>
                </select>
            </div>
            <div className="board">
                {board === 2 && (
                    <div className="teamscoreboard">
                        <Team name='home' teamscoreboard={true}></Team>  
                    </div>
                )}
                <div className="scoreboard">
                    <div className='title'>MADEKA SPORTS</div>
                    <div className='gamescoreboard'>
                        
                        <Team name='home' score={homeScore} fetchScore={fetchScore} controller={false} homeTeam={true} fouls={homeFouls} timeOuts={homeTimeOuts} teamscoreboard={false}></Team>  
                        <div className="match">
                            <GameTimer controller={false} time={time} fetchTime={fetchTime}></GameTimer>
                            <div className="perpo">
                                <GamePosession controller="home" fetchPosession={fetchPosession} homePosession={homePosession} awayPosession={awayPosession}></GamePosession>
                                <GamePeriod controller={false} fetchPeriod={fetchPeriod} period={period}></GamePeriod>
                                <GamePosession controller="away" fetchPosession={fetchPosession} homePosession={homePosession} awayPosession={awayPosession}></GamePosession>
                            </div>
                        </div>
                        <Team name='away' score={awayScore} fetchScore={fetchScore}  controller={false} homeTeam={false} fouls={awayFouls} timeOuts={awayTimeOuts} teamscoreboard={false}></Team>
                    </div>
                    {board === 3 && (
                        <div className="teamuniquescoreboard">
                            <div className="board-selector">
                                <label htmlFor="board-type">Select Team Board:</label>
                                <select id="board-type-team" value={boardTeam} onChange={handleBoardTeamChange}>
                                    <option value="home">Home</option>
                                    <option value="away">Away</option>
                                </select>
                            </div>
                            <Team name={boardTeam} teamscoreboard={true}></Team>  
                        </div>
                    )}
                    <div className='sign'>Powered by MDK SOLUTIONS</div>
                </div>
                {board === 2 && (
                    <div className="teamscoreboard">
                        <Team name='away' teamscoreboard={true}></Team>
                    </div>
                )}
            </div>
            <div className="board-shot-clock">
                <ShotClock name='shot-clock' shotClockTime={shotClockTime} timer={time} controller={false} />
            </div>
            {!isAuthenticated ? ( 
                <LoginButton /> 
            ) : ( 
                <> 
                    <LogoutButton /> 
                    <Profile />
                    <div className="controller">
                        <div className='title'>CONTROLLER</div>
                        <div className="gamescoreboard">
                            <Team name='home' score={homeScore} teamscoreboard={false} fetchScore={fetchScore} controller={true} homeTeam={true} fouls={homeFouls} timeOuts={homeTimeOuts} fetchFouls={fetchFouls} fetchTimeOut={fetchTimeOuts} fetchPosession={fetchPosession}></Team>          
                            <div className="match">
                                <GameTimer controller={true} time={time} fetchTime={fetchTime}></GameTimer>
                                <div className="perpo">
                                    <GamePosession controller="home" fetchPosession={fetchPosession} homePosession={homePosession} awayPosession={awayPosession}></GamePosession>
                                    <GamePeriod controller={true} fetchPeriod={fetchPeriod} period={period}></GamePeriod>
                                    <GamePosession controller="away" fetchPosession={fetchPosession} homePosession={homePosession} awayPosession={awayPosession}></GamePosession>
                                </div>
                                <ShotClock shotClockTime={shotClockTime} timer={time} controller={true} />
                            </div>
                            <Team name='away' score={awayScore} teamscoreboard={false} fetchScore={fetchScore} controller={true} homeTeam={false} fouls={awayFouls} timeOuts={awayTimeOuts} fetchFouls={fetchFouls} fetchTimeOut={fetchTimeOuts} fetchPosession={fetchPosession}></Team>
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
