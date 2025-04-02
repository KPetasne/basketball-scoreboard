import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './gameStats.css';
import { ONE_MINUTE, ONE_SECOND, INTERVAL_MS } from './gameConstants';
import actionTypes from './model/basketball/actionTypes';
import violationTypes from './model/basketball/violationTypes';
import turnOverTypes from './model/basketball/turnOverTypes';
import foulClassification from './model/basketball/foulClassification';
import foulTypes from './model/basketball/foulTypes';
import reboundTypes from './model/basketball/reboundTypes';
import assistTypes from './model/basketball/assistTypes';
import blockTypes from './model/basketball/blockTypes';
import stealTypes from './model/basketball/stealTypes';
import shotTypes from './model/basketball/shotTypes';
import PlayToPlayTable from './views/playToPlay';
import BasketballCourt from './views/basketballCourt';
import players from './team/player/player';

const GameStats = ({controller,time,shotClockTime,period,homeScore,awayScore, addPoints, view}) => {

    const [viewBox, setViewBox] = React.useState("0 0 2800 1500"); 
    const [plays, setPlays] = useState([]);
    const [lastPlayInfo, setLastPlayInfo] = useState([]);
    const [teamRight, setTeamRight] = useState('home'); // Estado para el equipo seleccionado
    const [teamPlayer, setTeamPlayer] = useState(''); // Estado para el ultimo jugador seleccionado
    const [info, setInfo] = useState(null); // Estado para la informacion del jugador seleccionado

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

    const [playInfo, setPlayInfo] = useState({
        actionType: '', 
        teamOffence: '',
        changeOffence: null,
        time: formatTime(time),
        period: period,
        shotClockTime: formatTime(shotClockTime),
        homeScore: homeScore,
        awayScore: awayScore,
        teamPosition: '',
        teamPlay: ''
    });
    
    const [violationInfo, setViolationInfo] = useState({
        violationType: '', 
        violationPlayer: '',
    });    
    
    const [foulInfo, setFoulInfo] = useState({
        foulClassification: '', // 'offensive' || 'defensive'
        foulType: '', // e.g., 'charge'
        foulPlayer: '', // Jugador que comete la falta
        playerFouled: '', // Jugador que recibe la falta (si aplica)
        onShot: null, // true, false o null
        and1: null, // true, false o null
        penalty: '', // Información sobre la penalización (1 tiro, 2 tiros, no aplica)
        player2:'',
    });

    const [substitutionInfo, setSubstitutionInfo] = useState({
        playerOut: '',
        playerIn: '',
    });

    const [turnOverInfo, setTurnOverInfo] = useState({
        turnOverType: '',
        turnOverPlayer: '',
    });

    const [stealInfo, setStealInfo] = useState({
        stealType: '',
        stealPlayer: '',
    });   

    const [assistInfo, setAssistInfo] = useState({
        assistType: '',
        assistPlayer: '',
    });

    const [reboundInfo, setReboundInfo] = useState({
        reboundType: '',
        reboundPlayer: '',
    });

    const [blockInfo, setBlockInfo] = useState({
        blockType: '', 
        blockPlayer: '',
    });

    const [shotInfo, setShotInfo] = useState({
        shotType: '',
        posx: null,
        posy: null,
        distanceFromHoop: null,
        points:'',
        shotPlayer: '',
        fouled: null,
        made: null,
        blocked: null,
        assisted: null,
        continueOffence: null,
    });

    const resetAllStates = async () => {
        setInfo(false);
        setTeamPlayer('');
        
        setPlayInfo({
            ...playInfo,
            actionType: '',
            changeOffence: null,
            teamPosition: '',
            teamPlay: ''
        });

        setViolationInfo({
            violationType: '', 
            violationPlayer: '',
        });

        setFoulInfo({
            foulClassification: '', 
            foulType: '', 
            foulPlayer: '',
            playerFouled: '',
            onShot: null,
            and1: null,
            penalty: '', // Información sobre la penalización (1 tiro, 2 tiros, no aplica)
            player2: ''
        });

        setSubstitutionInfo({
            playerOut: '',
            playerIn: '',
        });

        setTurnOverInfo({
            turnOverType: '', 
            turnOverPlayer: '',
        });

        setStealInfo({
            stealType: '', 
            stealPlayer: '',
        });

        setAssistInfo({
            assistType: '', 
            assistPlayer: '',
        });

        setReboundInfo({
            reboundType: '',
            reboundPlayer: '',
        });

        setBlockInfo({
            blockType: '', 
            blockPlayer: '',
        });

        setShotInfo({
            shotType: '', 
            posx: null,
            posy: null,
            distanceFromHoop: null,
            points: '',
            shotPlayer: '',
            fouled: null,
            made: null, //  'rebound' || 'assist' || 'foul' || 'block'
            blocked: null,
            assisted: null,
            continueOffence: null,
        });
    };
    
    useEffect(() => {
        // Cargar las jugadas desde el servidor al montar el componente
        fetchPlays();
        const interval = setInterval(() => {
            fetchPlays();
        },ONE_SECOND); // cada una decima de segundo actualiza la informacion
        return () => clearInterval(interval);
    }, []);

    const fetchPlays = async () => {
        const response = await axios.get('/plays');
        setPlays(response.data.plays);
        // fetchLastPlay(response.data.plays);
    };

    const fetchLastPlay = (plays) => {
        if (plays.length > 0) {
            const lastPlay = plays[plays.length - 1]; // Retrieve the last play
    
            // Update lastPlayInfo safely using a setter (if lastPlayInfo is state)
            setLastPlayInfo((prev) => ({
                ...prev,
                teamOffence: lastPlay.teamOffence,
                changeOffence: lastPlay.changeOffence,
                actionType: lastPlay.actionType,
            }));
    
            // Determine teamOffence for playInfo
            setPlayInfo((prev) => ({
                ...prev,
                teamOffence:
                    lastPlay.changeOffence
                        ? lastPlay.teamOffence === 'home'
                            ? 'away'
                            : 'home'
                        : lastPlay.actionType === 'endtime'
                        ? lastPlay.teamOffence // Use arrow logic for clarity
                        : lastPlay.teamOffence,
            }));
        }
    };

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setShotInfo({
            ...event.shotInfo,
            [name]: type === 'checkbox' ? checked : value
        });
        console.log("handleInputChange: " + JSON.stringify(playInfo, null, 2));
    };

    const handleActionTypeChange = (event) => {
        const actionType = event.target.value;
    
        // Update playInfo state safely
        
        setPlayInfo((prev) => ({
            ...prev,
            actionType,
        }));
        console.log("handleActionTypeChange: " + JSON.stringify(playInfo, null, 2));
    }

    const handleViolationTeamChange = (event) => {
        const teamPosition = event.target.value;
    
        // Update playInfo state safely
        if (playInfo.actionType === 'timeout'){
            fetchLastPlay(plays)
        }
        setPlayInfo((prev) => ({
            ...prev,
            teamPosition,
            teamOffence: playInfo.actionType === 'timeout' ? prev.teamOffence : null,
            changeOffence: playInfo.actionType === 'timeout' ? false : null,
            teamPlay:
                teamPosition === 'offensive'
                    ? prev.teamOffence === 'home'
                        ? 'away'
                        : prev.teamOffence === 'away'
                        ? 'away'
                        : 'home'
                    : null, // Handle non-offensive cases safely
        }));
        console.log("handleViolationTeamChange: " + JSON.stringify(playInfo, null, 2));
    };
    

    const handleInputFoulChange = (event) => {
        const { name, value, type, checked } = event.target;
        setShotInfo({
            ...event.shotInfo,
            [name]: type === 'checkbox' ? checked : value
        });
        setFoulInfo({
            ...event.foulInfo,
            onShot: type === 'checkbox' ? checked : value
        });
        console.log("handleInputFoulChange: " + JSON.stringify(playInfo, null, 2));
    };

    const handleTeamPlayerChange = (event) => {
        const teamOffence = event.target.value;
    
        // Update playInfo state safely using setPlayInfo
        setPlayInfo((prev) => ({
            ...prev,
            teamOffence,
            teamPlay: prev.actionType === 'start' ? teamOffence : prev.teamPlay,
            changeOffence: prev.actionType === 'start' ? false : prev.changeOffence,
        }));
        console.log("handleTeamPlayerChange: " + JSON.stringify(playInfo, null, 2));
    };
    

    const handleViolationChange = (event) => {
        // violationInfo.violationType = event.target.value;
        const violationType = event.target.value;

        // Update violationInfo state
        setViolationInfo((prev) => ({
            ...prev,
            violationType,
        }));

        fetchLastPlay(plays);
        if (playInfo.teamPosition === 'offensive'){
            const turnOverType = turnOverTypes.find((type) => type.value === violationType);

            if (turnOverType) {
                // Update turnOverInfo state
                setTurnOverInfo((prev) => ({
                    ...prev,
                    turnOverType: turnOverType.value,
                    category: turnOverType.category,
                }));

                // Update playInfo state based on category
                setPlayInfo((prev) => ({
                    ...prev,
                    teamPlay: prev.teamOffence,
                    changeOffence: turnOverType.category === 'team' ? true : null,
                }));
            }
        } else if (playInfo.teamPosition === 'defensive') {
            setPlayInfo((prev) => ({
                ...prev,
                changeOffence: false,
                teamPlay: prev.teamOffence === 'home' ? 'away' : 'home',
            }));
        } else {
            setPlayInfo((prev) => ({
                ...prev,
                changeOffence: false,
                teamPlay: 'both',
            }));
        }
        console.log("handleViolationChange: " + JSON.stringify(playInfo, null, 2));
    };

    const handleTurnOverChange = (event) => {
        const turnOverType = event.target.value;
    
        const turnOverCategory = turnOverTypes.find((type) => type.value === turnOverType)?.category;
        // Update turnOverInfo state safely
        setTurnOverInfo((prev) => ({
            ...prev,
            turnOverType,
            category: turnOverCategory
        }));

            // Update playInfo state based on category
        setPlayInfo((prev) => ({
            ...prev,
            teamPlay: prev.teamOffence,
        }));
    
        console.log("handleTurnOverChange: " + JSON.stringify(playInfo, null, 2));
        // Determine category dynamically and update playInfo
    };
    
    const handleSubstitutionTeamChange = (event) => {
        setPlayInfo((prev) => ({
            ...prev,
            teamPlay: event.target.value,
        }));
        console.log("handleSubstitutionTeamChange: " + JSON.stringify(playInfo, null, 2));
    }
    
    const handleSubstitutionChange = (event) => {
        setSubstitutionInfo({...event.substitutionInfo, playerIn: event.target.value})
        setPlayInfo((prev) => ({
            ...prev,
            changeOffence: false,
        }));
        console.log("handleSubstitutionChange: " + JSON.stringify(playInfo, null, 2));
    }

    const handleStealChange = (event) => {
        setStealInfo({ ...event.stealInfo, stealType: event.target.value });
        console.log("handleStealChange: " + JSON.stringify(playInfo, null, 2));
    }
    
    const handleShotTypeChange = (event) => {
        setShotInfo({ ...event.shotInfo, shotType: event.target.value });
        setPlayInfo({...event.playInfo,teamPlay: playInfo.teamOffence, teamPosition: 'offensive'})
        console.log("handleShotTypeChange: " + JSON.stringify(playInfo, null, 2));
    }

    const handleStealPlayerChange = (event) => {
        setStealInfo({ ...event.stealInfo, stealPlayer: event.target.value });
        setPlayInfo((prev) => ({
            ...prev,
            changeOffence: true,
        }));
        console.log("handleStealPlayerChange: " + JSON.stringify(playInfo, null, 2));
    }

    const handlePlayerAction = (event) => {
        const playerValue = event.target.value;
        console.log(playerValue);
        if (playInfo.actionType === 'shot') {
            // Update shotInfo state
            setShotInfo((prev) => ({
                ...prev,
                shotPlayer: playerValue,
            }));
        } else if (playInfo.actionType === 'turnover') {
            // Update playInfo state for turnovers
            setTurnOverInfo((prev) => ({
                ...prev,
                turnOverType: 'steal',
                turnOverPlayer: playerValue,
            }));
        } else if (playInfo.actionType === 'violation') {
            // Update playInfo state for turnovers
            setTurnOverInfo((prev) => ({
                ...prev,
                turnOverType: 'violation',
                turnOverPlayer: playerValue,
            }));
            setPlayInfo((prev) => ({
                ...prev,
                changeOffence: true,
            }));
        }else if (playInfo.actionType === 'substitution') {
            // Update substitutionInfo state
            setSubstitutionInfo((prev) => ({
                ...prev,
                playerOut: playerValue,
            }));
        }
        console.log("handlePlayerAction: " + JSON.stringify(playInfo, null, 2));
    };
    

    const handleFoulChange = (event) => {
        setFoulInfo({ ...event.foulInfo, playerFouled: event.target.value });
        if (foulInfo.foulClassification === 'offensive') {
            setPlayInfo({...event.playInfo, changeOffence: true});
        }else if (foulInfo.foulClassification === 'defensive' && !foulInfo.onShot) {
            setPlayInfo({...event.playInfo, changeOffence: false});
        }
    }

    const handleDoubleFoulChange = (event) => {
        setFoulInfo({ ...event.foulInfo, player2: event.target.value });
        setPlayInfo({...event.playInfo, changeOffence: false});
        console.log("handleDoubleFoulChange: " + JSON.stringify(playInfo, null, 2));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        submitPlay();
    };

    const submitPlay = async () => {
        // Handle scoring logic
        if (
            shotInfo.made &&
            (playInfo.actionType === 'shot' || (playInfo.actionType === 'foul' && foulInfo.onShot))
        ) {
            addPoints(playInfo.teamOffence, shotInfo.points);
    
            // Update team score based on teamOffence
            if (playInfo.teamOffence === 'home') {
                playInfo.homeScore += shotInfo.points;
            } else {
                playInfo.awayScore += shotInfo.points;
            }
        }
    
        // Update playInfo with the current time and shot clock
        playInfo.time = time;
        playInfo.shotClockTime = shotClockTime;
    
        // Handle possession changes after shots
        if (playInfo.actionType === 'shot') {
            if (shotInfo.made) {
                playInfo.changeOffence = true;
            } else if (shotInfo.continueOffence) {
                playInfo.changeOffence = false;
            } else {
                playInfo.changeOffence = true;
            }
        }
    
        // Construct the new play object
        const newPlay = {
            ...playInfo,
            ...violationInfo,
            ...foulInfo,
            ...substitutionInfo,
            ...turnOverInfo,
            ...stealInfo,
            ...assistInfo,
            ...reboundInfo,
            ...blockInfo,
            ...shotInfo,
        };

        // Send the play data to the server
        try {
            await axios.post('/plays', { play: newPlay });
            fetchPlays(); // Refresh the plays list after submission
        } catch (error) {
            console.error('Error registering the play:', error);
        }
        // Reset all states to prepare for the next play
        resetAllStates();
    };

    return (
        <div className="court-container">
            {controller === true && (
                <div>
                    <div>
                        <label>Equipo ofensiva derecha: </label>
                        <select value={teamRight} onChange={(e) => setTeamRight(e.target.value)}>
                            <option value="home">Home</option>
                            <option value="away">Away</option>
                        </select>
                    </div>
                    <div>
                        <div className='team-selector'>
                            <label>Equipo en posesion: </label> 
                            {/* setear posesion en base a la ultima accion */}
                            <label><input type="radio" name="teamPlayer" value="home" checked={playInfo.teamOffence==="home"} onChange={handleTeamPlayerChange} disabled={playInfo.teamOffence !== '' ? playInfo.teamOffence === 'home' ? false : true : playInfo.actionType === 'start' ? false : true}/>Home</label>
                            <label><input type="radio" name="teamPlayer" value="away" checked={playInfo.teamOffence==="away"} onChange={handleTeamPlayerChange} disabled={playInfo.teamOffence !== '' ? playInfo.teamOffence === 'away' ? false : true : playInfo.actionType === 'start' ? false : true}/>Away</label>
                        </div>
                        <label>Action type: </label> 
                        <select value={playInfo.actionType} onChange={handleActionTypeChange}>
                            <option value='' disabled>Select an option</option>
                            {actionTypes
                                .filter(action => playInfo.teamOffence === '' || playInfo.actionType === 'start' || lastPlayInfo.actionType === 'endtime' ? action.value === 'start' : action.value !== 'start') // Excluir "start" si no se ha seleccionado un equipo
                                .map((action, index) => (
                                    <option key={index} value={action.value}>
                                        {action.value.charAt(0).toUpperCase() + action.value.slice(1)}
                                    </option>
                                ))}
                        </select>
                        
                        <div>
                            {(playInfo.actionType === "violation" || playInfo.actionType === 'timeout') && (
                                <div>
                                    {/* Selector de Equipo de violacion si la misma es de tipo both */}
                                    <select
                                        value={playInfo.teamPosition}
                                        onChange={handleViolationTeamChange}
                                    >
                                        <option value="" disabled>Select Violation Team</option>                     
                                        <option value="offensive">Offensive</option>
                                        <option value="defensive">Defensive</option>
                                        {playInfo.actionType === "violation" && <option value="both">Both</option>}
                                    </select>
                                    

                                    {/* Selector de Tipo de Violación */}
                                    {playInfo.teamPosition != '' && playInfo.actionType === 'violation' && (
                                        <select
                                            value={violationInfo.violationType}
                                            onChange={handleViolationChange}
                                        >
                                            <option value="" disabled>Select Violation Type</option>
                                            {violationTypes
                                                .filter(type => playInfo.teamPosition === 'both' ? type.classification === 'both' : type.classification === playInfo.teamPosition || type.selection === 'both' ) // Excluir "offensive" o "defensive" según el equipo
                                                .map((violation, index) => (
                                                <option key={index} value={violation.value}>
                                                    {violation.label}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                    
                                    
                                </div>
                            )}
                            {playInfo.actionType === "substitution" && (
                                <div>
                                    {/* Selector de Equipo de violacion si la misma es de tipo both */}
                                    <select
                                        value={playInfo.teamPlay}
                                        onChange={handleSubstitutionTeamChange}
                                    >
                                        <option value="" disabled>Select Substitution Team</option>                     
                                        <option value="home">Home</option>
                                        <option value="away">Away</option>
                                    </select>
                                </div>
                            )}
                            {playInfo.actionType === "turnover" && (
                                <div>
                                    {/* Selector de TurnOver Type */}
                                    <select
                                        value={turnOverInfo.turnOverType}
                                        onChange={handleTurnOverChange}
                                    >
                                        <option value="" disabled>Select TurnOver Type</option>
                                        {/* Mostrar turnOverTypes que no sean de tipo "violation" */}
                                        {turnOverTypes
                                            .filter(type => type.type !== "violation") // Excluir "violation"
                                            .map((turnover, index) => (
                                                <option key={index} value={turnover.value}>
                                                    {turnover.label}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            )}
                            {playInfo.actionType === "shot" && (
                                <select value={shotInfo.shotType} onChange={(e) => handleShotTypeChange({...e,shotInfo})}>
                                    <option value="" disabled>Select Shot Type</option>
                                    {shotTypes.map((type, index) => (
                                        <option key={index} value={type}>
                                            {type.charAt(0).toUpperCase() + type.slice(1)} {/* Capitaliza la primera letra */}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                        
                        <div
                            style={{
                                display: ((playInfo.actionType === 'shot' && shotInfo.shotType !== '') || 
                                        (playInfo.actionType === 'turnover' ) || 
                                        (playInfo.actionType === 'violation' && playInfo.teamPosition === 'offensive' && turnOverInfo.category === 'personal') || 
                                        playInfo.actionType === 'substitution' && playInfo.teamPlay !== '')
                                    ? 'flex' 
                                    : 'none',
                                flexDirection: 'row',
                                marginLeft: '10px',
                            }}
                        >   
                            <select
                                value={
                                    playInfo.actionType === 'shot' ? shotInfo.shotPlayer :
                                    playInfo.actionType === 'turnover' ? turnOverInfo.turnOverPlayer :
                                    playInfo.actionType === 'violation' ? turnOverInfo.turnOverPlayer :
                                    playInfo.actionType === 'substitution' ? substitutionInfo.playerOut :
                                    ''
                                } // Selecciona el valor correspondiente según el tipo de acción
                                onChange={(e) => handlePlayerAction({...e})}
                            >
                                <option value="" disabled>Select Player</option>
                                {players
                                    .filter(player => player.onCourt && player.team === playInfo.teamOffence)
                                    .map(player => (
                                        <option key={player.id} value={player.name}>
                                            {player.name}
                                        </option>
                                    ))}
                            </select>
                            {playInfo.actionType === 'substitution' && substitutionInfo.playerOut && (
                            <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '10px' }}>
                                <label>Jugador que ingresa:
                                    <select value={substitutionInfo.playerIn} onChange={(e) => {handleSubstitutionChange({...e,setSubstitutionInfo})}}>
                                        <option value="" disabled>Select Player In</option>
                                        {players
                                            .filter(
                                                (player) =>
                                                    player.team === playInfo.teamOffence && !player.onCourt // Filtrar solo los jugadores en el banco del equipo actual
                                            )
                                            .map((player) => (
                                                <option key={player.id} value={player.name}>
                                                    {player.name}
                                                </option>
                                            ))}
                                    </select>
                                </label>
                            </div>
                            )}
                            {turnOverInfo.turnOverType === "steal" && (
                                <div style={{ display: playInfo.actionType === 'turnover' && turnOverInfo.turnOverType  ? 'flex' : 'none', flexDirection: 'row', marginLeft: '10px' }}>
                                {/* Selector de Steals si corresponde */}
                                    <select
                                        value={stealInfo.stealType}
                                        onChange={(e) => {handleStealChange({...e,setStealInfo})}}
                                    >
                                        <option value="" disabled>Select Steal Type</option>
                                        {stealTypes.map((steal, index) => (
                                            <option key={index} value={steal}>
                                                {steal}
                                            </option>
                                        ))}
                                    </select>
                                    <label>Jugador que recupero:
                                    <select value={stealInfo.stealPlayer} onChange={(e) => {handleStealPlayerChange({...e,setStealInfo})}}>
                                        <option value="" disabled>Select Steal Player</option>
                                        {players
                                            .filter(
                                                (player) =>
                                                    player.team !== playInfo.teamOffence && player.onCourt // Filtrar solo los jugadores en el banco del equipo actual
                                            )
                                            .map((player) => (
                                                <option key={player.id} value={player.name}>
                                                    {player.name}
                                                </option>
                                            ))}
                                    </select>
                                </label>
                                </div>     
                            )}
                            {playInfo.actionType === 'violation' && violationInfo.violationType === 'foul' && (
                                <div style={{ display:  'flex' , flexDirection: 'row', marginLeft: '10px' }}>
                                    <label>
                                        Clasificación de la Falta:
                                        <select
                                            value={foulInfo.foulClassification}
                                            onChange={(e) => setFoulInfo({...e.foulInfo, foulClassification: e.target.value})}
                                        >
                                            <option value="" disabled>Select Classification</option>
                                            {foulClassification.map((classification, index) => (
                                                <option key={index} value={classification}>
                                                    {classification.charAt(0).toUpperCase() + classification.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <label>
                                        Tipo de Falta:
                                        <select
                                            value={foulInfo.foulType}
                                            onChange={(e) => setFoulInfo({...e.foulInfo, foulType: e.target.value})}
                                            disabled={!foulInfo.foulClassification} // Desactiva si no hay una clasificación seleccionada
                                        >
                                            <option value="" disabled>Select Foul Type</option>
                                            {foulTypes
                                                .filter(foul => 
                                                    foul.classification === foulInfo.foulClassification || 
                                                    foul.classification === "both"
                                                )
                                                .map((foul, index) => (
                                                    <option key={index} value={foul.value}>
                                                        {foul.label}
                                                    </option>
                                                ))}
                                        </select>
                                    </label>
                                    {(foulInfo.foulClassification !== "doubleFoul" && foulInfo.foulClassification !== '') && (
                                        <>
                                            {/* Jugador que comete la falta */}
                                            <label>
                                                Jugador que hizo la falta:
                                                <select
                                                    value={foulInfo.foulPlayer}
                                                    onChange={(e) => setFoulInfo({ ...e.foulInfo, player: e.target.value })}
                                                >
                                                    <option value="" disabled>Select Player</option>
                                                    {players[foulInfo.foulClassification === "offensive" ? playInfo.teamOffence === 'home' ? 'home' : 'away' : playInfo.teamOffence === 'home' ? 'away' : 'home'].map((player, index) => (
                                                        <option key={index} value={player}>
                                                            {player}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>
                                            {foulInfo.foulClassification === 'defensive' && foulInfo.foulPlayer && (
                                                <label>
                                                    Fue en accion de tiro:
                                                    <input type="checkbox" name="fouled" checked={foulInfo.onShot} onChange={(e) => {handleInputFoulChange({...e,foulInfo,shotInfo})}} />
                                                </label>
                                            )}
                                            {/* Jugador afectado */}
                                            {foulInfo.foulPlayer && (foulInfo.foulClassification === 'offensive' || foulInfo.onShot !== null) && (
                                                <label>
                                                    Jugador que recibió la falta:
                                                    <select
                                                        value={foulInfo.playerFouled}
                                                        onChange={(e) => {handleFoulChange({...e,foulInfo,playInfo})}}
                                                    >
                                                        <option value="" disabled>Select Player</option>
                                                        {players[foulInfo.foulClassification === "offensive" ? playInfo.teamOffence === 'home' ? 'away' : 'home' : playInfo.teamOffence === 'home' ? 'home' : 'away'].map((player, index) => (
                                                            <option key={index} value={player}>
                                                                {player}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </label>
                                            )}
                                        </>
                                    )}
                                    {foulInfo.foulType === "doubleFoul" && (
                                        <>
                                            <label>
                                                Jugador del equipo 1:
                                                <select
                                                    value={foulInfo.playerFouled}
                                                    onChange={(e) => setFoulInfo({ ...e.foulInfo, player: e.target.value })}
                                                >
                                                    <option value="" disabled>Select Player 1</option>
                                                    {players[playInfo.teamOffence].map((player, index) => (
                                                        <option key={index} value={player}>
                                                            {player}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>
                                            {foulInfo.player && (
                                                <label>
                                                    Jugador del equipo 2:
                                                    <select
                                                        value={foulInfo.playerFouled}
                                                        onChange={(e) => {handleDoubleFoulChange({...e,foulInfo,playInfo})}}
                                                    >
                                                        <option value="" disabled>Select Player 2</option>
                                                        {players[!playInfo.teamOffence].map((player, index) => (
                                                            <option key={index} value={player}>
                                                                {player}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </label>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        {playInfo.changeOffence !== null && playInfo.actionType !== 'shot' && playInfo.actionType && (<button type="submit" onClick={handleSubmit}>Registrar Jugada</button>)}
                    </div>
                </div>
            )}
            {(controller === true || view === 'court') && <BasketballCourt controller={controller} teamRight={teamRight} playInfo={playInfo} shotInfo={shotInfo} setShotInfo={setShotInfo} />}
            {controller=== true && shotInfo.posx !== null && shotInfo.posy !== null && playInfo.teamOffence !== null && shotInfo.player !== null &&(
                <form className="shot-form" onSubmit={handleSubmit}>
                    <h3>Detalles del Tiro</h3>
                    <label>Equipo: {playInfo.teamOffence}</label>
                    <label>Jugador: {shotInfo.player}</label>
                    <label>Tiro de: {shotInfo.points} puntos</label>
                    <label>Distancia: {shotInfo.distanceFromHoop} metros</label>
                    <label>Tipo de Tiro: {shotInfo.shotType}</label>
                    <label>¿Tiro Exitoso? <input type="checkbox" name="made" checked={shotInfo.made} onChange={(e) => {handleInputChange({...e, shotInfo})}} /></label>
                    {shotInfo.made ? (
                        <label>
                            Assist:
                            <select value={assistInfo.assistType} onChange={(e) => e.value === 'none' ? shotInfo.assisted = false : setAssistInfo({...assistInfo, assistType: e.target.value})}>
                                <option value='Select Rebound Type' disabled>Select an option</option>
                                {assistTypes.map((type, index) => (
                                    <option key={index} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)} {/* Capitaliza la primera letra */}
                                    </option>
                                ))}
                            </select>
                            {assistInfo.assistType !== "false" && (
                                <select value={assistInfo.player} onChange={(e) => setAssistInfo({...assistInfo, assistPlayer: e.target.value})}>
                                    <option value="" disabled>Select Player Assist</option>
                                    {players
                                        .filter(player => player.onCourt && player.name !== shotInfo.player ) // Excluir al jugador que anotó
                                        .map(player => (
                                            <option key={player.id} value={player.name}>
                                                {player.name}
                                            </option>
                                        ))
                                    }
                                </select>
                            )}
                        </label>
                    ) : (
                        <label>
                            Block:
                            <select value={shotInfo.continueOffence ? 'offensive' : 'defensive'} onChange={(e) => shotInfo.blocked = value && setBlockInfo({...blockInfo, blockType: e.target.value})}>
                                <option value='' disabled>Select Block Type</option>
                                {blockTypes.map((type, index) => (
                                    <option key={index} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)} {/* Capitaliza la primera letra */}
                                    </option>
                                ))}
                            </select>
                            <select value={reboundInfo.player} onChange={(e) => setBlockInfo({...blockInfo, blockPlayer: e.target.value})}>
                                <option value='' disabled>Select player Rebound</option>
                                {players
                                    .filter(player =>  player.onCourt && player.team !== playInfo.teamOffence) // Excluir al jugador que anotó
                                    .map(player => (
                                        <option key={player.id} value={player.name}>
                                            {player.name}
                                        </option>
                                        ))
                                }
                            </select>
                            Rebote:
                            <select value={shotInfo.continueOffence ? 'offensive' : 'defensive'} onChange={(e) => shotInfo.rebounded = value && setReboundInfo({...reboundInfo, reboundType: e.target.value})}>
                                <option value='' disabled>Select Rebound Type</option>
                                {reboundTypes.map((type, index) => (
                                    <option key={index} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)} {/* Capitaliza la primera letra */}
                                    </option>
                                ))}
                            </select>
                            <select value={reboundInfo.player} onChange={(e) => setReboundInfo({...reboundInfo, player: e.target.value})}>
                                <option value='' disabled>Select player Rebound</option>
                                {players
                                    .filter(player => player.onCourt && player.team === shotInfo.continueOffence ? true : false) // Excluir al jugador que anotó
                                    .map(player => (
                                        <option key={player.id} value={player.name}>
                                            {player.name}
                                        </option>
                                        ))
                                }
                            </select>
                        </label>
                    )}

                    {shotInfo.player && playInfo.teamOffence && shotInfo.points && (<button type="submit">Registrar Tiro</button>)}
                </form>
            )}
            {(controller=== true || view === 'playtoplay') &&
                <div>
                    <PlayToPlayTable plays={plays} />
                </div>
            }
        </div>
    );
};

export default GameStats;
