import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './BasketballCourt.css';
import { ONE_MINUTE, ONE_SECOND, INTERVAL_MS } from './gameConstants';

const BasketballCourt = ({controller,time,shotClockTime,period,homeScore,awayScore, addPoints}) => {

    const [viewBox, setViewBox] = React.useState("0 0 2800 1500"); 
    const [plays, setPlays] = useState([]);
    const [team, setTeam] = useState('home'); // Estado para el equipo seleccionado
    const [selectedLocals, setSelectedLocals] = useState([]);  
    const [selectedAways, setSelectedAways] = useState([]);  
    const [teamPlayer, setTeamPlayer] = useState(''); // Estado para el ultimo jugador seleccionado
    const [info, setInfo] = useState(false); // Estado para la informacion del jugador seleccionado
    const [players, setPlayers] = useState([
        { id: 1, name: 'Player 1', team: 'home', onCourt: true },
        { id: 2, name: 'Player 2', team: 'home', onCourt: true },
        { id: 3, name: 'Player 3', team: 'home', onCourt: true },
        { id: 4, name: 'Player 4', team: 'home', onCourt: true },
        { id: 5, name: 'Player 5', team: 'home', onCourt: true },
        { id: 6, name: 'Player 6', team: 'home', onCourt: false },
        { id: 1, name: 'Player 1', team: 'away', onCourt: false },
        { id: 2, name: 'Player 2', team: 'away', onCourt: true },
        { id: 3, name: 'Player 3', team: 'away', onCourt: true },
        { id: 4, name: 'Player 4', team: 'away', onCourt: true },
        { id: 5, name: 'Player 5', team: 'away', onCourt: true },
        { id: 6, name: 'Player 6', team: 'away', onCourt: true },
    ]);

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
        actionType: '', // 'shot' || 'violation' || 'timeout' || 'substitution' || 'freethrow' || 'endtime' || 'turnover'
        teamOffence: '',
        changeOffence: null,
        time: formatTime(time),
        period: period,
        shotClockTime: formatTime(shotClockTime),
        homeScore: homeScore,
        awayScore: awayScore,
        teamPlay: ''
    });

    const actionTypes = [
        "violation", 
        "turnover", 
        "shot", 
        "start", 
        "endtime", 
        "substitution", 
        "timeout", 
        "miscelaneous",
    ];
    
    const [violationInfo, setViolationInfo] = useState({
        violationType: '', // 'jumpball' || 'shotClockEnd' || 'halfCourtViolation' || 'backCourtViolation' || 'outOfBounds' || 'foul' || 'laneViolation' || 'doubleDribble' || 'travel' || 'threeSeconds' || 'fiveSeconds' || 'tenSeconds' || 'shotClockViolation' || 'illegalScreen' || 'offensiveGoaltending' || 'defensiveGoaltending' || 'kickedBall' || 'delayOfGame' || 'illegalDefense' || 'technical' || 'flagrant' || 'doublefoul' || 'triplefoul' || 'unsportsmanlike' || 'disqualifying' || 'personal' || 'team'
        player: '',
    });    

    const violationTypes = [
        { value: "jumpball", label: "Jump Ball", category: "team", validatePossession: true, classification: "both", autoChangePossession: false },
        { value: "shotClockEnd", label: "Shot Clock End", category: "team", validatePossession: false, classification: "offensive", autoChangePossession: true },
        { value: "halfCourtViolation", label: "Half Court Violation", category: "team", validatePossession: false, classification: "offensive", autoChangePossession: true },
        { value: "backCourtViolation", label: "Back Court Violation", category: "team", validatePossession: false, classification: "offensive", autoChangePossession: true },
        { value: "outOfBounds", label: "Out of Bounds", category: "team", validatePossession: false, classification: "both", autoChangePossession: false },
        { value: "foul", label: "Foul", category: "personal", validatePossession: false, classification: "defensive", autoChangePossession: false },
        { value: "laneViolation", label: "Lane Violation", category: "team", validatePossession: false, classification: "defensive", autoChangePossession: false },
        { value: "doubleDribble", label: "Double Dribble", category: "personal", validatePossession: false, classification: "offensive", autoChangePossession: true },
        { value: "travel", label: "Travel", category: "personal", validatePossession: false, classification: "offensive", autoChangePossession: true },
        { value: "threeSeconds", label: "Three Seconds", category: "team", validatePossession: false, classification: "offensive", autoChangePossession: true },
        { value: "fiveSeconds", label: "Five Seconds", category: "team", validatePossession: false, classification: "both", autoChangePossession: true },
        { value: "shotClockViolation", label: "Shot Clock Violation", category: "team", validatePossession: false, classification: "offensive", autoChangePossession: true },
        { value: "offensiveGoaltending", label: "Offensive Goaltending", category: "team", validatePossession: false, classification: "offensive", autoChangePossession: true },
        { value: "defensiveGoaltending", label: "Defensive Goaltending", category: "team", validatePossession: false, classification: "defensive", autoChangePossession: true },
        { value: "kickedBall", label: "Kicked Ball", category: "team", validatePossession: false, classification: "both", autoChangePossession: true },
        { value: "delayOfGame", label: "Delay of Game", category: "team", validatePossession: false, classification: "both", autoChangePossession: false },
        { value: "illegalDefense", label: "Illegal Defense", category: "team", validatePossession: false, classification: "defensive", autoChangePossession: false },
    ];
    
    const [foulInfo, setFoulInfo] = useState({
        foulClassification: '', // 'offensive' || 'defensive'
        foulType: '', // e.g., 'charge'
        player: '', // Jugador que comete la falta
        playerFouled: '', // Jugador que recibe la falta (si aplica)
        onShot: null, // true, false o null
        and1: null, // true, false o null
        penalty: '', // Información sobre la penalización (1 tiro, 2 tiros, no aplica)
        player2:'',
    });

    const foulClassification = [
        'defensive',
        'offensive',
        'doublefoul'
    ];
    
    const foulTypes = [
        { value: "charge", label: "Charge", classification: "offensive", penalty: "noShots", possession: "switch" },
        { value: "blocking", label: "Blocking", classification: "defensive", penalty: "teamDependent", possession: "sameTeam" },
        { value: "personal", label: "Personal", classification: "both", penalty: "teamDependent", possession: "switch" },
        { value: "shooting", label: "Shooting", classification: "both", penalty: "2Shots", possession: "switch" },
        { value: "technical", label: "Technical", classification: "both", penalty: "1Shot", possession: "sameTeam" },
        { value: "flagrant1", label: "Flagrant 1", classification: "both", penalty: "2Shots", possession: "sameTeam" },
        { value: "flagrant2", label: "Flagrant 2", classification: "both", penalty: "2Shots", possession: "sameTeam" },
        { value: "unsportsmanlike", label: "Unsportsmanlike", classification: "both", penalty: "2Shots", possession: "sameTeam" },
        { value: "disqualifying", label: "Disqualifying", classification: "both", penalty: "2Shots", possession: "sameTeam" },
        { value: "doubleFoul", label: "Double Foul", classification: "both", penalty: "noShots", possession: "sameTeam" },
        { value: "looseBall", label: "Loose Ball", classification: "both", penalty: "teamDependent", possession: "switch" },
        { value: "overTheBack", label: "Over The Back", classification: "both", penalty: "teamDependent", possession: "switch" },
        { value: "illegalScreen", label: "Illegal Screen", classification: "offensive", penalty: "noShots", possession: "switch" },
        { value: "push", label: "Push", classification: "both", penalty: "teamDependent", possession: "switch" },
        { value: "holding", label: "Holding", classification: "both", penalty: "teamDependent", possession: "switch" },
        { value: "handCheck", label: "HandCheck", classification: "both", penalty: "teamDependent", possession: "switch" },
        { value: "reaching", label: "Reaching", classification: "both", penalty: "teamDependent", possession: "switch" },
        { value: "teambench", label: "Team bench", classification: "both", penalty: "teamDependent", possession: "switch" },
        { value: "delayOfGame", label: "Delay of Game", classification: "both", penalty: "1Shot", possession: "switch" },
    ];

    const [substitutionInfo, setSubstitutionInfo] = useState({
        playerOut: '',
        playerIn: '',
    });

    const [turnOverInfo, setTurnOverInfo] = useState({
        turnOverType: '', // 'personal' || 'team'
        player: '',
    });

    const turnOverTypes = [
        { value: "personal", label: "Personal Turnover", type: "steal", stopsGame: false, category: "personal" }, 
        { value: "team", label: "Team Turnover", type: "violation", stopsGame: true, category: "team" }, 
        { value: "badPass", label: "Bad Pass", type: "steal", stopsGame: false, category: "personal" }, 
        { value: "travel", label: "Travel", type: "violation", stopsGame: true, category: "personal" }, 
        { value: "doubleDribble", label: "Double Dribble", type: "violation", stopsGame: true, category: "personal" }, 
        { value: "threeSeconds", label: "Three Seconds", type: "violation", stopsGame: true, category: "team" }, 
        { value: "fiveSeconds", label: "Five Seconds", type: "violation", stopsGame: true, category: "team" }, 
        { value: "tenSeconds", label: "Ten Seconds", type: "violation", stopsGame: true, category: "team" }, 
        { value: "shotClockViolation", label: "Shot Clock Violation", type: "violation", stopsGame: true, category: "team" }, 
        { value: "steal", label: "Steal", type: "steal", stopsGame: false, category: "personal" }, 
        { value: "offensiveFoul", label: "Offensive Foul", type: "violation", stopsGame: true, category: "personal" }, 
        { value: "illegalScreen", label: "Illegal Screen", type: "violation", stopsGame: true, category: "personal" }, 
        { value: "laneViolation", label: "Lane Violation", type: "violation", stopsGame: true, category: "team" }, 
        { value: "outOfBounds", label: "Out of Bounds", type: "violation", stopsGame: true, category: "team" }, 
        { value: "backCourt", label: "Back Court", type: "violation", stopsGame: true, category: "team" }, 
        { value: "offensiveGoaltending", label: "Offensive Goaltending", type: "violation", stopsGame: true, category: "team" }, 
        { value: "stepOutOfBounds", label: "Step Out of Bounds", type: "violation", stopsGame: true, category: "personal" }, 
        { value: "heldBall", label: "Held Ball", type: "violation", stopsGame: true, category: "team" }, 
        { value: "kickedBall", label: "Kicked Ball", type: "violation", stopsGame: true, category: "team" }, 
        { value: "delayOfGame", label: "Delay of Game", type: "violation", stopsGame: true, category: "team" }, 
        { value: "turnoverViolation", label: "Turnover Violation", type: "violation", stopsGame: true, category: "team" }, 
        { value: "jumpBall", label: "Jump Ball", type: "violation", stopsGame: true, category: "team" }, 
    ];
    

    const [stealInfo, setStealInfo] = useState({
        stealType: '', // 'interception' || 'deflection' || 'strip'
        player: '',
    });

    const stealTypes = [
        'interception', // Interceptar un pase
        'deflection', // Desviar el balón sin controlarlo
        'strip', // Quitar el balón directamente al oponente
        'poke', // Golpear el balón ligeramente para sacarlo del control del oponente
        'trap', // Robar el balón tras bloquear o acorralar al oponente
        'doubleTeam', // Robo en equipo donde dos jugadores presionan al atacante
        'helpDefense', // Robo proveniente de un defensor secundario que apoya
        'pickPocket', // Robo rápido desde las manos del oponente sin cometer falta
        'dive', // Lanzarse al suelo para recuperar un balón suelto
        'anticipation', // Robo anticipando el pase o movimiento del oponente
        'breakaway', // Robo en una jugada de transición rápida
        'forcedTurnover', // Robo debido a presión que fuerza al atacante a cometer un error
        'transitionSteal', // Robo durante una contra ofensiva rápida
        'pressSteal', // Robo provocado por una defensa de presión intensa
        'fullCourtTrap', // Robo en una trampa en toda la cancha
        'fastBreakInterception', // Robo de un pase en una jugada de contraataque
        'closeOut', // Robo al cerrar rápidamente al oponente que intenta recibir el balón
        'overPlay', // Robo al adelantarse a la línea de pase
        'jumpSteal', // Robo al saltar para atrapar o desviar el balón en el aire
    ];    

    const [assistInfo, setAssistInfo] = useState({
        assistType: '', // 'bouncepass' || 'chestpass' || 'overheadpass' || 'lobpass' || 'noLookPass' || 'behindTheBack' || 'wrapAround' || 'alleyoop' || 'handoff' || 'dribbleHandoff' || 'inbound' || 'outlet' || 'skip' || 'touch' || 'postEntry' || 'pickAndRoll' || 'cut' || 'backdoor' || 'screen' || 'pick' || 'roll' || 'pop' || 'fade' || 'slip' || 'flare' || 'pin' || 'seal' || 'dive' || 'spotUp' || 'relocate' || 'rebound' || 'foul' || 'block'
        player: '',
    });

    const assistTypes = [
        'none',
        'bouncepass',
        'chestpass',
        'overheadpass',
        'lobpass',
        'noLookPass',
        'behindTheBack',
        'wrapAround',
        'alleyoop',
        'handoff',
        'dribbleHandoff',
        'inbound',
        'outlet',
        'skip',
        'touch',
        'postEntry',
        'pickAndRoll',
        'cut',
        'backdoor',
        'screen',
        'pick',
        'roll',
        'pop',
        'fade',
        'slip',
        'flare',
        'pin',
        'seal',
        'dive',
        'spotUp',
        'relocate',
        'rebound',
        'foul',
        'block'
    ];    

    const [reboundInfo, setReboundInfo] = useState({
        reboundType: '', // 'offensive' || 'defensive' 
        player: '',
    });

    const reboundTypes = [
        'offensive',
        'defensive'
    ];    

    const [blockInfo, setBlockInfo] = useState({
        blockType: '', 
        player: '',
    });

    const blockTypes = [
        'none',
        'regular', // Bloqueo estándar
        'chaseDown', // Bloqueo en una persecución rápida
        'help', // Bloqueo en ayuda defensiva
        'doubleTeam', // Bloqueo realizado en una defensa doble
        'tip', // Bloqueo suave que desvía el balón
        'backboard', // Bloqueo contra el tablero
        'alleyoop', // Bloqueo de un intento de alley-oop
        'jumpShot', // Bloqueo de un tiro en suspensión
        'dunk', // Bloqueo de un intento de clavada
        'layup', // Bloqueo de un intento de bandeja
        'hookShot', // Bloqueo de un gancho
        'closeOut', // Bloqueo cerrando espacio rápidamente al tirador
        'postMove', // Bloqueo en un movimiento en el poste
        'transition', // Bloqueo durante una transición rápida
        'stealBlock', // Bloqueo que también genera un robo
        'pin', // Bloqueo donde el balón queda "pegado" contra el tablero
        'rejection', // Bloqueo agresivo que envía el balón lejos
        'switch', // Bloqueo realizado tras un cambio de marca defensiva
    ];    

    const [shotInfo, setShotInfo] = useState({
        shotType: '', // 'jumpshot' || 'dunk' || 'layup' || 'hookshot' || 'fadeaway' || 'alleyoop' || 'bankshot' || 'turnaround' || 'tipin' || 'putback' || 'stepback' || 'pullup' || 'floating' || 'fingerroll' || 'slamdunk' || 'jumpstep' || 'jumpfloat' || 'jumpfade' || 'jumpbank' || 'jumpturn' || 'jumpstep' || 'jumpfloat' || 'jumpfinger' || 'jumpslam' || 'jumpdunk' || 'jumpalley' || 'jumpbounce' || 'jumpputback' || 'jumpstepback' || 'jumpfloating' || 'jumpfingerroll' || 'jumpslamdunk' || 'jumpjumpstep' || 'jumpjumpfloat' || 'jumpjumpfade' || 'jumpjumpbank' || 'jumpjumpturn' || 'jumpjumpstep' || 'jumpjumpfloat' || 'jumpjumpfinger' || 'jumpjumpslam' || 'jumpjumpdunk' || 'jumpjumpalley' || 'jumpjumpbounce' || 'jumpjumpputback' || 'jumpjumpstepback' || 'jumpjumpfloating' || 'jumpjumpfingerroll' || 'jumpjumpslamdunk' || 'jumpjumpjumpstep' || 'jumpjumpjumpfloat' || 'jumpjumpjumpfade' || 'jumpjumpjumpbank' || 'jumpjumpjumpturn' || 'jumpjumpjumpstep' || 'jumpjumpjumpfloat' || 'jumpjumpjumpfinger' || 'jumpjumpjumpslam' || 'jumpjumpjumpdunk' || 'jumpjumpjumpalley' || 'jumpjumpjumpbounce' || 'jumpjumpjumpputback' || 'jumpjumpjumpstepback' || 'jumpjumpjumpfloating' || 'jumpjumpjumpfingerroll' || 'jumpjumpjumpslamdunk' || 'jumpjumpjumpjumpstep' || 'jumpjumpjumpjumpfloat' || 'jumpjumpjumpjumpfade' || 'jumpjumpjumpjumpbank' || 'jumpjumpjumpjumpturn' || 'jumpjumpjumpjumpstep' || 'jumpjumpjumpjumpfloat' || 'jumpjumpjumpjumpfinger' || 'jumpjumpjumpjumpslam' || 'jumpjumpjumpjumpdunk' || 'jumpjumpjumpjumpalley' || 'jumpjumpjumpjumpbounce' || 'jumpjumpjump
        x: null,
        y: null,
        distanceFromHoop: null,
        points:'',
        player: '',
        fouled: false,
        made: false, //  'rebound' || 'assist' || 'foul' || 'block'
        blocked: false,
        assisted: false,
        continueOffence: false,
        // time: formatTime(time),
        // period: period,
        // shotClockTime: formatTime(shotClockTime),
        // homeScore: homeScore,
        // awayScore: awayScore
    });

    const shotTypes = [
        'jumpshot',
        'dunk',
        'layup',
        'hookshot',
        'fadeaway',
        'alleyoop',
        'bankshot',
        'turnaround',
        'tipin',
        'putback',
        'stepback',
        'pullup',
        'floating',
        'fingerroll',
        'slamdunk',
        'jumpstep',
        'jumpfloat',
        'jumpfade',
        'jumpbank',
        'jumpturn',
        'jumpputback',
        'jumpstepback',
        'jumpfingerroll',
        'jumpslamdunk',
        'jumpalley',
        'jumpbounce',
        'jumpjumpstep',
        'jumpjumpfloat',
        'jumpjumpfade',
        'jumpjumpbank',
        'jumpjumpturn',
        'jumpjumpputback',
        'jumpjumpstepback',
        'jumpjumpfingerroll',
        'jumpjumpjumpslam',
        'jumpjumpjumpfade',
        'jumpjumpjumpturn',
        'jumpjumpjumpbank',
        'jumpjumpjumpfloat',
        'jumpjumpjumpdunk',
        'jumpjumpjumpalley'
    ];    

    const filteredPlayers = players.filter(player => 
        player.team === playInfo.teamOffence && player.onCourt
    );
    // useEffect(() => {  
    //     setShotInfo(prevShotInfo => ({  
    //         ...prevShotInfo,  
    //         time: formatTime(time),
    //         period: period,
    //         shotClockTime: formatTime(shotClockTime),
    //         homeScore: homeScore,  
    //         awayScore: awayScore  
    //     }));  
    // }, [time, period, shotClockTime, homeScore, awayScore]); // Dependiendo de estas props  

    const resetAllStates = () => {
        setInfo(false);
        setTeamPlayer('');

        setPlayInfo({
            actionType: '', 
            teamOffence: '',
            changeOffence: null,
            teamPlay: ''
        });

        setViolationInfo({
            violationType: '', 
            player: '',
        });

        setFoulInfo({
            foulClassification: '', 
            foulType: '', 
            player: '',
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
            player: '',
        });

        setStealInfo({
            stealType: '', 
            player: '',
        });

        setAssistInfo({
            assistType: '', 
            player: '',
        });

        setReboundInfo({
            reboundType: '',
            player: '',
        });

        setBlockInfo({
            blockType: '', 
            player: '',
        });

        setShotInfo({
            shotType: '', 
            x: null,
            y: null,
            distanceFromHoop: null,
            points: '',
            player: '',
            fouled: false,
            made: false, 
            blocked: false,
            assisted: false,
            continueOffence: false,
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
    };

    const calculatePoints = (x, y) => {  
        const HoopX = (team === 'home' && playInfo.teamOffence === 'home' && 2642.5 || 
                team === 'home' && playInfo.teamOffence === 'away' && 157.5 || 
                team === 'away' && playInfo.teamOffence === 'away' && 2642.5 || 
                team === 'away' && playInfo.teamOffence === 'home' && 157.5
        ); // Coordenadas X del aro en función del equipo  
        const threePointLineRadius = 6.75; // Radio de la línea de tres puntos en mm (convertido a unidades de SVG)  
        
        // Distancia desde el aro del equipo atacante 
        const distanceFromHoop = (Math.sqrt((x - HoopX) ** 2 + (y - 750) ** 2)/100).toFixed(2);
        
        // Condiciones para 2 puntos (verificar si el tiro es dentro de las zonas de 2 puntos)  
        const isInTwoPointZone = (team === 'home' && playInfo.teamOffence === 'away' && x <= 299 && y >= 90 && y <= 1410) ||  
                                (team === 'away' && playInfo.teamOffence === 'home' && x <= 299 && y >= 90 && y <= 1410) || 
                                (team === 'away' && playInfo.teamOffence === 'away' && x >= 2501 && y >= 90 && y <= 1410) ||   
                                (team === 'home' && playInfo.teamOffence === 'home' && x >= 2501 && y >= 90 && y <= 1410) ||   
                                (team === 'away' && playInfo.teamOffence === 'away' && x < 2501 && distanceFromHoop < threePointLineRadius) ||
                                (team === 'home' && playInfo.teamOffence === 'home' && x > 299 && distanceFromHoop < threePointLineRadius) ||
                                (team === 'home' && playInfo.teamOffence === 'away' && x > 299 && distanceFromHoop < threePointLineRadius) ||
                                (team === 'away' && playInfo.teamOffence === 'home' && x < 2501 && distanceFromHoop < threePointLineRadius)
        ;
        const points = isInTwoPointZone ? 2 : 3; // Calcular los puntos del tiro
        // Agregar la nueva posición de clic al estado 
        setShotInfo({ ...shotInfo, x, y, points, distanceFromHoop, });
    };   

    const handleInputChange = async (event) => {
        const { name, value, type, checked } = event.target;
        setShotInfo({
            ...shotInfo,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleInputFoulChange = async (event) => {
        const { name, value, type, checked } = event.target;
        setShotInfo({
            ...shotInfo,
            [name]: type === 'checkbox' ? checked : value
        });
        setFoulInfo({
            ...foulInfo,
            onShot: type === 'checkbox' ? checked : value
        });
    };

    const handleTeamPlayerChange = async (event) => {
        setPlayInfo({
            ...playInfo,
            teamOffence: event.target.value
        });
    };

    const handleViolationChange = async (event) => {
        setViolationInfo({ ...violationInfo, violationType: event.target.value });
        if (playInfo.team === playInfo.teamOffence){
            setTurnOverInfo({ ...turnOverInfo, turnOverType: violationInfo.violationType });
            setPlayInfo({ ...playInfo, changeOffence: true});
        } else {
            setPlayInfo({ ...playInfo, changeOffence: false});
        }
    };

    const handleTurnOverChange = async (event) => {
        setTurnOverInfo({ ...turnOverInfo, turnOverType: event.target.value });
        if (turnOverInfo.category === 'team') {
            setPlayInfo({...playInfo, changeOffence: true});
        }
    }    
    
    const handleSubstitutionChange = async (event) => {
        setSubstitutionInfo({...substitutionInfo, playerIn: event.target.value})
    }

    const handleStealChange = async (event) => {
        setStealInfo({ ...stealInfo, stealType: event.target.value });
    }
    
    const handlePlayerAction = async (event) => {
        if (playInfo.actionType === 'shot') {
            setShotInfo({ ...shotInfo, player: event.target.value });
        } else if (playInfo.actionType === 'turnover') {
            setPlayInfo({...playInfo, changeOffence: true});
            if (turnOverInfo.type !== 'steal') {
                setPlayInfo({...playInfo, changeOffence: true});
            }
        } else if (playInfo.actionType === 'substitution') {
            setSubstitutionInfo({ ...substitutionInfo, playerOut: event.target.value });
        }
    }

    const handleFoulChange = async (event) => {
        setFoulInfo({ ...foulInfo, playerFouled: event.target.value });
        if (foulInfo.foulClassification === 'offensive') {
            setPlayInfo({...playInfo, changeOffence: true});
        }else if (foulInfo.foulClassification === 'defensive' && !foulInfo.onShot) {
            setPlayInfo({...playInfo, changeOffence: false});
        }
    }

    const handleDoubleFoulChange = async (event) => {
        setFoulInfo({ ...foulInfo, player2: event.target.value });
        setPlayInfo({...playInfo, changeOffence: false});
    }

    // const handleLocalSelect = (value) => {  
    //     setSelectedLocals((prev) =>  
    //         prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]  
    //     );        
    //     setShotInfo({
    //         ...shotInfo,
    //         player: value
    //     });
    // };  

    // const handleAwaySelect = (value) => {  
    //     setSelectedAways((prev) =>  
    //         prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]  
    //     );
    //     setShotInfo({
    //         ...shotInfo,
    //         player: value
    //     });
    // };  

    const handleSubmit = async (event) => {
        event.preventDefault();
        shotInfo.made && (playInfo.actionType === 'shot' || (playInfo.actionType === 'foul' && foulInfo.onShot )) ? addPoints(playInfo.teamOffence, shotInfo.points) && 
            playInfo.teamOffence === 'home' ? playInfo.homeScore += shotInfo.points : playInfo.awayScore += shotInfo.points : '' ;
        playInfo.time = time;
        playInfo.shotClockTime = shotClockTime;
        playInfo.actionType === 'shot' && shotInfo.made ? playInfo.changeOffence = true : shotInfo.continueOffence ? playInfo.changeOffence = false : playInfo.changeOffence = true;
        const newPlay = {
            ...cleanObject(playInfo),
            ...cleanObject(violationInfo),
            ...cleanObject(foulInfo),
            ...cleanObject(substitutionInfo),
            ...cleanObject(turnOverInfo),
            ...cleanObject(stealInfo),
            ...cleanObject(assistInfo),
            ...cleanObject(reboundInfo),
            ...cleanObject(blockInfo),
            ...cleanObject(shotInfo),
        };
        // setPlays(...plays, newPlay); // Enviar la información al servidor
        // Aquí puedes enviar la información del tiro al servidor
        try {
            await axios.post('/plays', { play: newPlay });
            fetchPlays();
            console.log('Jugada registrada exitosamente' + newPlay);
        } catch (error) {
            console.error('Error al registrar la jugada:', error);
        }
        setTeamPlayer(playInfo.teamOffence);
        // Reinicia el formulario
        resetAllStates();
        if (playInfo.changeOffence){
            setPlayInfo({teamOffence: playInfo.teamOffence === 'home' ? 'away' : 'home' });
        } else {
            setPlayInfo({teamOffence: playInfo.teamOffence});
        }
        setSelectedLocals([]);  
        setSelectedAways([]);  
    };

    
    const handleCourtClick = (event) => {    
        const svg = event.currentTarget;
        const rect = svg.getBoundingClientRect();
        
        // // Calcular las coordenadas en relación al SVG  
        const x = (event.clientX - rect.left) * (svg.viewBox.baseVal.width / rect.width);  
        const y = (event.clientY - rect.top) * (svg.viewBox.baseVal.height / rect.height);  

        if (playInfo.teamOffence && shotInfo.player) {
            calculatePoints(x, y);
        }
    };

    return (
        <div className="court-container">
            {controller === true && (
                <div>
                    <div>
                        <label>Equipo ofensiva derecha: </label>
                        <select value={team} onChange={setTeam(team)}>
                            <option value="home">Home</option>
                            <option value="away">Away</option>
                        </select>
                    </div>
                    <div>
                        <label>Action type: </label> 
                        <select value={playInfo.actionType} onChange={(e) => setPlayInfo({...playInfo, actionType: e.target.value})}>
                            <option value='' disabled>Select an option</option>
                            {actionTypes.map((type, index) => (
                                    <option key={index} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)} {/* Capitaliza la primera letra */}
                                    </option>
                                ))}
                        </select>
                        <div style={{ display: playInfo.teamOffence !== '' ? 'flex' : 'none', flexDirection: 'row', marginLeft: '10px'}}>
                            <label>Equipo en posesion: </label> 
                            {/* setear posesion en base a la ultima accion */}
                            <label style={{ marginRight: '10px' }}><input type="radio" name="teamPlayer" value="home" checked={playInfo.teamOffence==='home'} onChange={handleTeamPlayerChange}/>Home</label>
                            <label style={{ marginRight: '10px' }}><input type="radio" name="teamPlayer" value="away" checked={playInfo.teamOffence==='away'} onChange={handleTeamPlayerChange} />Away</label>
                        </div>
                        
                        <div>
                            {playInfo.actionType === "violation" && (
                                <div>
                                    {/* Selector de Equipo de violacion si la misma es de tipo both */}
                                    <select
                                        value={playInfo.team}
                                        onChange={(e) => setPlayInfo({ ...playInfo, team: e.target.value })}
                                    >
                                        <option value="" disabled>Select Violation Team</option>                     
                                        <option value="home">Home</option>
                                        <option value="away">Away</option>
                                    </select>
                                    

                                    {/* Selector de Tipo de Violación */}
                                    {playInfo.team && (
                                        <select
                                            value={violationInfo.violationType}
                                            onChange={handleViolationChange()}
                                        >
                                            <option value="" disabled>Select Violation Type</option>
                                            {violationTypes
                                                .filter(type => type.classification === playInfo.team || type.classification === 'both') // Excluir "offensive" o "defensive" según el equipo
                                                .map((violation, index) => (
                                                <option key={index} value={violation.value}>
                                                    {violation.label}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                    
                                    
                                </div>
                            )}
                            {playInfo.actionType === "turnover" && (
                                <div>
                                    {/* Selector de TurnOver Type */}
                                    <select
                                        value={turnOverInfo.turnOverType}
                                        onChange={handleTurnOverChange()}
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
                                <select value={shotInfo.shotType} onChange={(e) => setShotInfo({...shotInfo, shotType: e.target.value})}>
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
                                display: (playInfo.actionType === 'shot' || 
                                        playInfo.actionType === 'turnover' || 
                                        playInfo.actionType === 'substitution')
                                    ? 'flex' 
                                    : 'none',
                                flexDirection: 'row',
                                marginLeft: '10px',
                            }}
                        >   
                            {/* {[1, 2, 3, 4, 5].map(value => (  
                                <label key={value} style={{ display: 'flex', alignItems: 'center' }}>  
                                    <input  
                                        type="radio"
                                        name="player"  
                                        value={value}  
                                        checked={playInfo.teamOffence === 'home' && selectedLocals.includes(value)}  
                                        onChange={() => handleLocalSelect(value)}  
                                        disabled={playInfo.teamOffence !== 'home' && (playInfo.actionType === 'shot' || playInfo.actionType === 'turnover' || playInfo.actionType === 'substitution')}  
                                    />  
                                    {value}  
                                </label>  
                            ))}  
                            {[1, 2, 3, 4, 5].map(value => (  
                                <label key={value} style={{ display: 'flex', alignItems: 'center' }}>  
                                    <input  
                                        type="radio"  
                                        name="player" 
                                        value={value}  
                                        checked={playInfo.teamOffence === 'away' && selectedAways.includes(value)}  
                                        onChange={() => handleAwaySelect(value)}  
                                        disabled={playInfo.teamOffence !== 'away' && (playInfo.actionType === 'shot' || playInfo.actionType === 'turnover' || playInfo.actionType === 'substitution')}  
                                    />  
                                    {value}  
                                </label>  
                            ))}   */}
                            <select
                                value={
                                    playInfo.actionType === 'shot' ? shotInfo.player :
                                    playInfo.actionType === 'turnover' ? turnOverInfo.player :
                                    playInfo.actionType === 'substitution' ? substitutionInfo.playerOut :
                                    ''
                                } // Selecciona el valor correspondiente según el tipo de acción
                                onChange={handlePlayerAction}
                            >
                                {filteredPlayers
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
                                    <select value={substitutionInfo.playerIn} onChange={handleSubstitutionChange}>
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
                                        onChange={handleStealChange}
                                    >
                                        <option value="" disabled>Select Steal Type</option>
                                        {stealTypes.map((steal, index) => (
                                            <option key={index} value={steal}>
                                                {steal.label}
                                            </option>
                                        ))}
                                    </select>
                                    <label>Jugador que ingresa:
                                    <select value={substitutionInfo.playerIn} onChange={handleSubstitutionChange}>
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
                            {playInfo.actionType === 'violation' && violationInfo.violationType === 'foul' && (
                                <div style={{ display:  'flex' , flexDirection: 'row', marginLeft: '10px' }}>
                                    <label>
                                        Clasificación de la Falta:
                                        <select
                                            value={foulInfo.foulClassification}
                                            onChange={(e) => setFoulInfo({...foulInfo, foulClassification: e.target.value})}
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
                                            onChange={(e) => setFoulInfo({...foulInfo, foulType: e.target.value})}
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
                                    {(foulInfo.foulClassification !== "doubleFoul") && (
                                        <>
                                            {/* Jugador que comete la falta */}
                                            <label>
                                                Jugador que hizo la falta:
                                                <select
                                                    value={foulInfo.player}
                                                    onChange={(e) => setFoulInfo({ ...foulInfo, player: e.target.value })}
                                                >
                                                    <option value="" disabled>Select Player</option>
                                                    {players[foulInfo.foulClassification === "offensive" ? playInfo.teamOffence : !playInfo.teamOffence].map((player, index) => (
                                                        <option key={index} value={player}>
                                                            {player}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>
                                            {foulInfo.foulClassification === 'defensive' && foulInfo.player && (
                                                <label>
                                                    Fue en accion de tiro:
                                                    <input type="checkbox" name="fouled" checked={foulInfo.onShot} onChange={handleInputFoulChange} />
                                                </label>
                                            )}
                                            {/* Jugador afectado */}
                                            {foulInfo.player && foulInfo.onShot !== null && (
                                                <label>
                                                    Jugador que recibió la falta:
                                                    <select
                                                        value={foulInfo.playerFouled}
                                                        onChange={handleFoulChange}
                                                    >
                                                        <option value="" disabled>Select Player</option>
                                                        {players[foulInfo.foulClassification === "offensive" ? !playInfo.teamOffence : playInfo.teamOffence].map((player, index) => (
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
                                                    onChange={(e) => setFoulInfo({ ...foulInfo, player: e.target.value })}
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
                                                        onChange={handleDoubleFoulChange}
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
                        {playInfo.changeOffence !== null && playInfo.actionType !== 'shot' && (<button type="submit" onSubmit={handleSubmit}>Registrar Jugada</button>)}
                    </div>
                </div>
            )}
            <svg className="court" viewBox={viewBox} onClick={controller ? handleCourtClick : null} width="100%" height="100%" display={controller && (shotInfo.fouled || (playInfo.actionType === 'shot' && shotInfo.player)) ? 'block' : 'none'}>                
                
                {/* Líneas triple izquierda*/}
                <circle cx="157.5" cy="750" r="675" stroke="white" strokeWidth="5" fill="#f0a52d"  />
                <rect   
                    x={0} // Coordenada X de la esquina superior izquierda  
                    y={0}  // Coordenada Y de la esquina superior  
                    width={299} // Ancho del rectángulo  
                    height={90}
                    fill=' #f8c471'  // Alto del rectángulo  
                /> 
                <rect   
                    x={0} // Coordenada X de la esquina superior izquierda  
                    y={1410}  // Coordenada Y de la esquina superior  
                    width={299} // Ancho del rectángulo  
                    height={90}
                    fill=' #f8c471' // Alto del rectángulo  
                />  
                <rect   
                    x={-1} // Coordenada X de la esquina superior izquierda  
                    y={93}  // Coordenada Y de la esquina superior  
                    width={299} // Ancho del rectángulo  
                    height={1314}
                    fill=' #f0a52d' // Alto del rectángulo  
                />    
                <line x1="0" y1="90" x2="299" y2="90" stroke="white" strokeWidth="5" />
                <line x1="0" y1="1410" x2="299" y2="1410" stroke="white" strokeWidth="5" />

                {/* Líneas triple derecha*/}
                <circle cx="2642.5" cy="750" r="675" stroke="white" strokeWidth="5" fill="#f0a52d" />
                <rect   
                    x={2501} // Coordenada X de la esquina superior izquierda  
                    y={0}  // Coordenada Y de la esquina superior  
                    width={299} // Ancho del rectángulo  
                    height={90}
                    fill=' #f8c471'  // Alto del rectángulo  
                />
                <rect   
                    x={2501} // Coordenada X de la esquina superior izquierda  
                    y={1410}  // Coordenada Y de la esquina superior  
                    width={299} // Ancho del rectángulo  
                    height={90}
                    fill=' #f8c471'  // Alto del rectángulo  
                />
                <rect   
                    x={2500} // Coordenada X de la esquina superior izquierda  
                    y={93}  // Coordenada Y de la esquina superior  
                    width={301} // Ancho del rectángulo  
                    height={1314}
                    fill=' #f0a52d' // Alto del rectángulo  
                />    
                <line x1="2501" y1="90" x2="2800" y2="90" stroke="white" strokeWidth="5" />
                <line x1="2501" y1="1410" x2="2800" y2="1410" stroke="white" strokeWidth="5" />

                {/* Línea central */}
                <line x1="1400" y1="0" x2="1400" y2="1500" stroke="white" strokeWidth="5" />
                
                {/* Círculos */}
                <circle cx="580" cy="750" r="180" stroke="white" strokeWidth="5" fill="none" />
                <circle cx="1400" cy="750" r="180" stroke="white" strokeWidth="5" fill="none" />
                <circle cx="2220" cy="750" r="180" stroke="white" strokeWidth="5" fill="none" />
                
                {/* Líneas llave */}
                <line x1="0" y1="505" x2="580" y2="505" stroke="white" strokeWidth="5" />
                <line x1="0" y1="995" x2="580" y2="996" stroke="white" strokeWidth="5" />
                <line x1="580" y1="505" x2="580" y2="995" stroke="white" strokeWidth="5" />
                <line x1="2220" y1="996" x2="2800" y2="996" stroke="white" strokeWidth="5" />
                <line x1="2220" y1="505" x2="2800" y2="505" stroke="white" strokeWidth="5" />
                <line x1="2220" y1="505" x2="2220" y2="995" stroke="white" strokeWidth="5" />
                
                {/* Adicionales llave */}
                <line x1="175" y1="495" x2="175" y2="505" stroke="white" strokeWidth="5" />
                <line x1="175" y1="995" x2="175" y2="1005" stroke="white" strokeWidth="5" />
                <line x1="265" y1="500" x2="305" y2="500" stroke="white" strokeWidth="10" />
                <line x1="265" y1="1000" x2="305" y2="1000" stroke="white" strokeWidth="10" />
                <line x1="390" y1="495" x2="390" y2="505" stroke="white" strokeWidth="5" />
                <line x1="390" y1="995" x2="390" y2="1005" stroke="white" strokeWidth="5" />
                <line x1="480" y1="495" x2="480" y2="505" stroke="white" strokeWidth="5" />
                <line x1="480" y1="995" x2="480" y2="1005" stroke="white" strokeWidth="5" />
                <line x1="2625" y1="495" x2="2625" y2="505" stroke="white" strokeWidth="5" />
                <line x1="2625" y1="995" x2="2625" y2="1005" stroke="white" strokeWidth="5" />
                <line x1="2535" y1="500" x2="2495" y2="500" stroke="white" strokeWidth="10" />
                <line x1="2535" y1="1000" x2="2495" y2="1000" stroke="white" strokeWidth="10" />
                <line x1="2410" y1="495" x2="2410" y2="505" stroke="white" strokeWidth="5" />
                <line x1="2410" y1="995" x2="2410" y2="1005" stroke="white" strokeWidth="5" />
                <line x1="2320" y1="495" x2="2320" y2="505" stroke="white" strokeWidth="5" />
                <line x1="2320" y1="995" x2="2320" y2="1005" stroke="white" strokeWidth="5" />
                
                
                {/* Aro y tablero */} 
                <line x1="120" y1="675" x2="120" y2="825" stroke="white" strokeWidth="5" />
                <line x1="120" y1="750" x2="135" y2="750" stroke="white" strokeWidth="5" />
                <circle cx="157.5" cy="750" r="23" stroke="white" strokeWidth="5" fill="none" />
                <line x1="2680" y1="675" x2="2680" y2="825" stroke="white" strokeWidth="5" />
                <line x1="2680" y1="750" x2="2665" y2="750" stroke="white" strokeWidth="5" />
                <circle cx="2642.5" cy="750" r="23" stroke="white" strokeWidth="5" fill="none" />

                {/* Semicírculo a 1.25 metros del círculo de tiro */}
                <line x1="120" y1="625" x2="157.5" y2="625" stroke="white" strokeWidth="5" />
                <path
                    d="M 157.5 625
                    A 125 125 0 0 1 157.5 875"
                    stroke="white"
                    strokeWidth="5"
                    fill="none"
                />  
                <line x1="120" y1="875" x2="157.5" y2="875" stroke="white" strokeWidth="5" />
                <line x1="2680" y1="625" x2="2642.5" y2="625" stroke="white" strokeWidth="5" />
                <path
                    d="M 2642.5 625
                    A 125 125 0 1 0 2642.5 875"
                    stroke="white"
                    strokeWidth="5"
                    fill="none"
                />         
                <line x1="2680" y1="875" x2="2642.5" y2="875" stroke="white" strokeWidth="5" />
                
                {/* Toda la cancha */}
                <line x1="0" y1="0" height="1500" width="2800" />

                {controller === true && shotInfo.x !== null && shotInfo.y !== null && (
                    <g>
                        {/* Línea diagonal de la "X" */}
                        <line
                            x1={shotInfo.x - 15}
                            y1={shotInfo.y - 15}
                            x2={shotInfo.x + 15}
                            y2={shotInfo.y + 15}
                            stroke="red"
                            strokeWidth="5"
                        />
                        {/* Línea diagonal opuesta de la "X" */}
                        <line
                            x1={shotInfo.x + 15}
                            y1={shotInfo.y - 15}
                            x2={shotInfo.x - 15}
                            y2={shotInfo.y + 15}
                            stroke="red"
                            strokeWidth="5"
                        />
                    </g>
                )}
                {/* Renderizar las marcas X donde se hizo clic */}  
                {/* {clicks.map((click, index) => (  
                    <text key={index} x={click.x} y={click.y} fill="red" fontSize="30">X</text>  
                ))}   */}
                                    
            </svg>
            {controller=== true && shotInfo.x !== null && shotInfo.y !== null && playInfo.teamOffence !== null && shotInfo.player !== null &&(
                <form className="shot-form" onSubmit={handleSubmit}>
                    <h3>Detalles del Tiro</h3>
                    <label>Equipo: {playInfo.teamOffence}</label>
                    <label>Jugador: {shotInfo.player}</label>
                    <label>Tiro de: {shotInfo.points} puntos</label>
                    <label>Distancia: {shotInfo.distanceFromHoop} metros</label>
                    <label>Tipo de Tiro: {shotInfo.shotType}</label>
                    <label>¿Tiro Exitoso? <input type="checkbox" name="made" checked={shotInfo.made} onChange={handleInputChange} /></label>
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
                                <select value={assistInfo.player} onChange={(e) => setAssistInfo({...assistInfo, player: e.target.value})}>
                                    <option value="" disabled>Select Player Assist</option>
                                    {filteredPlayers
                                        .filter(player => player.name !== shotInfo.player) // Excluir al jugador que anotó
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
                            <select value={reboundInfo.player} onChange={(e) => setBlockInfo({...blockInfo, player: e.target.value})}>
                                <option value='' disabled>Select player Rebound</option>
                                {filteredPlayers
                                .filter(player => player.name) // Excluir al jugador que anotó
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
                                {filteredPlayers
                                .filter(player => player.name) // Excluir al jugador que anotó
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

            <div className="plays-list">
                <h3>Tiros Registrados</h3>
                <ul>
                    
                    {plays && plays.map((play, index) => (
                        <li key={index}>
                            {play.matchPlays}/{play.periodPlay} H {play.homeScore} - {play.awayScore} A, {play.period}-{play.time}-{play.shotClockTime}, Equipo: {play.teamOffence}, Jugador: {play.player}, {play.made ? 'Tiro Exitoso' : 'Tiro Fallido'}{play.made && play.assisted ? ', Asistente:' + play.assistplayer : ''}, Puntos: {play.points}, Posición: ({play.x}, {play.y})
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default BasketballCourt;
