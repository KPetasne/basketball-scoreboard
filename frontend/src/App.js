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
import GameStats from './match/gameStats.js';
import { useSocket } from './context/SocketContext';
import DraggableShotClock from './match/shotClock/DraggableShotClock';
import BoardLayout from './board/boardLayout.js';

import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
const domain = process.env.REACT_APP_AUTH0_DOMAIN || "dev-u3c555b5wr3ui240.us.auth0.com"; 
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID || "ABoNb46j1b4TRkNsuSK74tZEDQB9zlmn";


function App() {
    const { isAuthenticated, isLoading } = useAuth0(); if (isLoading) { return <div>Loading ...</div>; }
    const socket = useSocket();
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
    const [control, setControl] = useState(1);
    const [boardTeam, setBoardTeam] = useState(1);
    const [courtView, setCourtView] = useState(false);
    const [playToPlayView, setPlayToPlayView] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [viewMode, setViewMode] = useState("output"); // o "overlay"
    const [showTopbar, setShowTopbar] = useState(false);

    useEffect(() => {
        if (!socket) return;

        const handler = (data) => {
            console.log('Recibido game_update:', data);
            const home = data.home.score;
            const away = data.away.score;
            setHomeScore(home);
            setAwayScore(away);
        };

        socket.on('game_update', handler);

        const fetchAllData = async () => {
            //await fetchScore();
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

        return () => socket.off('game_update', handler);
    }, [socket]);

    useEffect(() => {
        if (viewMode === 'ads') {
            const timeout = setTimeout(() => setViewMode('output'), 5000);
            return () => clearTimeout(timeout);
        }
    }, [viewMode]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (e.clientY <= 50) {
            setShowTopbar(true);
            } else {
            setShowTopbar(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const sendAction = (type, team, data) => {
        if (!socket) return;

        const gameId = "gameID01";
    
        const payload = {
            gameId,
            type,
            team,
            time: new Date().toISOString(),
            data,
            events: [],
        };

        console.log('frontend new action: ', payload);
        socket.emit('game_action', payload);
    };

    const fetchScore = async () => {
        //const response = await axios.get('/score');
        home = gameState.home.score;
        away = gameState.away.score;
        setHomeScore(home);
        setAwayScore(away);
    };

    const addPoints = async (team, points) => {
        sendAction(
            "SCORE",
            team,
            {"points": points}
        )
        //await axios.post('/score', { team, points });
        //fetchScore();
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

    const handleControlChange = (event) => {
        setControl(parseInt(event.target.value));
    };

    const handleBoardTeamChange = (event) => {
        setBoardTeam(event.target.value);
    };

    const handleCourtView = (event) => {
        setCourtView(event.target.checked);
    };

    const handlePlayToPlayView = (event) => {
        setPlayToPlayView(event.target.checked);
    };

    return (

        <div className="App">
            <div
                className={`topbar ${showTopbar ? 'visible' : 'hidden'}`}
                onMouseEnter={() => setShowTopbar(true)}
                onMouseLeave={() => setShowTopbar(false)}
            >
                <div className="topbar-left">
                    {!menuOpen && (
                    <div className="hamburger" onClick={() => setMenuOpen(true)}>
                        &#9776;
                    </div>
                    )}
                    <div className="current-view">
                        {control === 1 && '📊 Score Board'}
                        {control === 2 && '🎛 Controller'}
                        {control === 3 && '📝 Actions'}
                        {control === 1 && viewMode === 'output' && '- 🖥 Estadio'}
                        {control === 1 && viewMode === 'overlay' && '- 📺 Overlay'}
                        {control === 1 && viewMode === 'ads' && '- 💼 Publicidad'}
                        {control === 1 && board === 1 && '🏀 Main Board '}
                        {control === 1 && board === 2 && '🏆 Team Score Board '}
                        {control === 1 && board === 3 && '👥 Team Unique Board '}
                        {control === 1 && courtView && '🏟 Court View '}
                        {control === 1 && playToPlayView && ' 🎬 Play To Play '}
                    </div>
                </div>

                <div className="topbar-center">
                    <div className="logo">
                    <img src="/logo-mdk.svg" alt="MDK Logo" />
                    <span className="logo-text">MADEKA SPORTS</span>
                    </div>
                </div>

                <div className="topbar-right">
                    {!isAuthenticated ? (
                    <LoginButton />
                    ) : (
                    <>
                        <Profile />
                        <LogoutButton />
                    </>
                    )}
                </div>
            </div>
            {/* Menú deslizable */}
            <div className={`side-menu ${menuOpen ? 'open' : ''}`}>
                <div className="menu-title">
                    🎮 Control Panel
                    <span className="close-btn" onClick={() => setMenuOpen(false)}>✖</span>
                </div>
                

                <div className="menu-section">
                    <div className="menu-title">🧭 Control Mode</div>
                    <div className="menu-options">
                        <div className="menu-option-group">
                            <div
                                className={`menu-option ${control === 1 ? 'active' : ''}`}
                                onClick={() => setControl(1)}
                            >
                                📊 Score Board
                            </div>

                            {/* Submenú desplegable solo visible si control === 1 */}
                            {control === 1 && (
                                <div className="submenu-list">
                                    <div className="submenu-heading">🎯 Views</div>
                                    <div
                                    className={`submenu-option ${board === 1 ? 'active' : ''}`}
                                    onClick={() => handleBoardChange({ target: { value: 1 } })}
                                    >
                                    🏀 Main Board
                                    </div>
                                    <div
                                    className={`submenu-option ${board === 2 ? 'active' : ''}`}
                                    onClick={() => handleBoardChange({ target: { value: 2 } })}
                                    >
                                    🏆 Team Score Board
                                    </div>
                                    <div
                                    className={`submenu-option ${board === 3 ? 'active' : ''}`}
                                    onClick={() => handleBoardChange({ target: { value: 3 } })}
                                    >
                                    👥 Team Unique Board
                                    </div>

                                    <div className="submenu-divider" />

                                    <div className="submenu-heading">📺 Extras</div>
                                    <div
                                    className={`submenu-option ${courtView ? 'active' : ''}`}
                                    onClick={() => setCourtView(!courtView)}
                                    >
                                    🏟 Court View
                                    </div>
                                    <div
                                    className={`submenu-option ${playToPlayView ? 'active' : ''}`}
                                    onClick={() => setPlayToPlayView(!playToPlayView)}
                                    >
                                    🎬 Play To Play
                                    </div>
                                </div>
                            )}
                        </div>
                        <div
                        className={`menu-option ${control === 2 ? 'active' : ''}`}
                        onClick={() => {
                            setControl(2);
                            setMenuOpen(false);
                        }}
                        >
                        🎛 Board Controller
                        </div>
                        <div
                        className={`menu-option ${control === 3 ? 'active' : ''}`}
                        onClick={() => {
                            setControl(3);
                            setMenuOpen(false);
                        }}
                        >
                        📝 Action Controller
                        </div>
                    </div>
                </div>
                
            </div>
            {control === 1 && (
            <>
                {viewMode === "ads" && (
                <BoardLayout mode="ads" onExitAd={() => setViewMode("output")} />
                )}

                {(viewMode === "output" || viewMode === "overlay") && (
                <BoardLayout mode={viewMode} onExitAd={() => setViewMode("output")}>
                    <div
                    className={`${
                        board === 2
                        ? "layout-team-view"
                        : board === 3
                        ? "layout-unique"
                        : "layout-default"
                    }`}
                    >
                    {/* Team Scoreboard en costados (si aplica) */}
                    {board === 2 && <Team name="home" teamscoreboard />}

                    {/* Marcador principal */}
                    <div className="main-scoreboard">
                        <div className="gamescoreboard">
                        <Team
                            name="home"
                            score={homeScore}
                            addPoints={addPoints}
                            controller={false}
                            homeTeam={true}
                            fouls={homeFouls}
                            timeOuts={homeTimeOuts}
                            teamscoreboard={false}
                        />

                        <div className="match">
                            <GameTimer
                            controller={false}
                            time={time}
                            fetchTime={fetchTime}
                            />
                            <div className="perpo">
                            <GamePosession
                                controller="home"
                                fetchPosession={fetchPosession}
                                homePosession={homePosession}
                                awayPosession={awayPosession}
                            />
                            <GamePeriod
                                controller={false}
                                fetchPeriod={fetchPeriod}
                                period={period}
                            />
                            <GamePosession
                                controller="away"
                                fetchPosession={fetchPosession}
                                homePosession={homePosession}
                                awayPosession={awayPosession}
                            />
                            </div>
                        </div>

                        <Team
                            name="away"
                            score={awayScore}
                            addPoints={addPoints}
                            controller={false}
                            homeTeam={false}
                            fouls={awayFouls}
                            timeOuts={awayTimeOuts}
                            teamscoreboard={false}
                        />
                        </div>

                        {/* Tablero único por equipo debajo */}
                        {board === 3 && (
                        <div className="teamuniquescoreboard">
                            <Team name={boardTeam} teamscoreboard />
                        </div>
                        )}
                    </div>

                    {/* Team Scoreboard derecho (si aplica) */}
                    {board === 2 && <Team name="away" teamscoreboard />}
                    </div>
                </BoardLayout>
                )}

                {/* ShotClock flotante */}
                <DraggableShotClock>
                <ShotClock
                    name="shot-clock"
                    shotClockTime={shotClockTime}
                    timer={time}
                    controller={false}
                />
                </DraggableShotClock>

                {/* Vistas extendidas debajo */}
                {(courtView || playToPlayView) && (
                <div className="extended-views">
                    {courtView && (
                    <GameStats
                        view="court"
                        time={time}
                        shotClockTime={shotClockTime}
                        period={period}
                        homeScore={homeScore}
                        awayScore={awayScore}
                        addPoints={addPoints}
                        controller={false}
                    />
                    )}
                    {playToPlayView && (
                    <GameStats
                        view="playtoplay"
                        time={time}
                        shotClockTime={shotClockTime}
                        period={period}
                        homeScore={homeScore}
                        awayScore={awayScore}
                        addPoints={addPoints}
                        controller={false}
                    />
                    )}
                </div>
                )}
            </>
            )}
            {control === 2 && (
                <>
                <div className="controller">
                    <div className='title'>CONTROLLER</div>
                        <div className="gamescoreboard">
                            <Team name='home' score={homeScore} teamscoreboard={false} addPoints={addPoints} controller={true} homeTeam={true} fouls={homeFouls} timeOuts={homeTimeOuts} fetchFouls={fetchFouls} fetchTimeOuts={fetchTimeOuts} fetchPosession={fetchPosession}></Team>          
                            <div className="match">
                                <GameTimer controller={true} time={time} fetchTime={fetchTime}></GameTimer>
                                <div className="perpo">
                                    <GamePosession controller="home" fetchPosession={fetchPosession} homePosession={homePosession} awayPosession={awayPosession}></GamePosession>
                                    <GamePeriod controller={true} fetchPeriod={fetchPeriod} period={period}></GamePeriod>
                                    <GamePosession controller="away" fetchPosession={fetchPosession} homePosession={homePosession} awayPosession={awayPosession}></GamePosession>
                                </div>
                                <ShotClock shotClockTime={shotClockTime} timer={time} controller={true} />
                            </div>
                            <Team name='away' score={awayScore} teamscoreboard={false} addPoints={addPoints} controller={true} homeTeam={false} fouls={awayFouls} timeOuts={awayTimeOuts} fetchFouls={fetchFouls} fetchTimeOuts={fetchTimeOuts} fetchPosession={fetchPosession}></Team>
                        </div>
                        <div className='controls'><button onClick={resetScores}>Reset</button></div>
                </div>
                </>
            )}
            {control === 3 && (
                <div className="controller">
                    {control === 3 && (
                        <>
                            <div className='title'>Registro de Jugadas</div>
                            <GameStats time={time} shotClockTime={shotClockTime} period={period} homeScore={homeScore} awayScore={awayScore} addPoints={addPoints} controller={true} />
                        </>
                    )}
                </div>
            )}
            <div className='sign'>Powered by MDK SOLUTIONS</div>
        </div>
    );
}
const Auth0App = () => ( <Auth0Provider domain={domain} clientId={clientId} authorizationParams={{ redirect_uri: window.location.origin }} > <App /> </Auth0Provider> ); 

export default Auth0App;
