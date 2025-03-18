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
    const [teamPlayer, setTeamPlayer] = useState([]);

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
        awayScore: awayScore
    });
    // || 'rebound' || 'assist' || 'block' || 'steal' || 'charge' || 'technical' || 'flagrant' || 'doublefoul' || 'triplefoul' || 'unsportsmanlike' || 'disqualifying' || 'personal' || 'team' || 'offensive' || 'defensive' || 'looseball' || 'deadball' || 'jumpball' || 'technical' || 'flagrant' || 'doublefoul' || 'triplefoul' || 'unsportsmanlike' || 'disqualifying' || 'personal' || 'team'
    // || 'shot' || 'foul' || 'timeout' || 'substitution' || 'jumpball' || 'freethrow' || 'violation' || 'turnover' || 'rebound' || 'assist' || 'block' || 'steal' || 'charge' || 'technical' || 'flagrant' || 'doublefoul' || 'triplefoul' || 'unsportsmanlike' || 'disqualifying' || 'personal' || 'team' || 'offensive' || 'defensive' || 'looseball' || 'deadball' || 'jumpball' || 'technical' || 'flagrant' || 'doublefoul' || 'triplefoul' || 'unsportsmanlike' || 'disqualifying' || 'personal' || 'team' || 'offensive' || 'defensive' || 'looseball' || 'deadball' || 'jumpball' || 'technical' || 'flagrant' || 'doublefoul' || 'triplefoul' || 'unsportsmanlike' || 'disqualifying' || 'personal' || 'team' || 'offensive' || 'defensive' || 'looseball' || 'deadball' || 'jumpball' || 'technical' || 'flagrant' || 'doublefoul' || 'triplefoul' || 'unsportsmanlike' || 'disqualifying' || 'personal' || 'team' || 'offensive' || 'defensive' || 'looseball' || 'deadball' || 'jumpball' || 'technical' || 'flagrant' || 'doublefoul' || 'triplefoul' || 'unsportsmanlike' || 'disqualifying' || 'personal' || 'team' || 'offensive' || 'defensive' || 'looseball' || 'deadball' || 'jumpball' || 'technical' || 'flagrant' || 'doublefoul' || 'triplefoul' || 'unsportsmanlike' || 'disqualifying' || 'personal' || 'team' || 'offensive' || 'defensive' || 'looseball' || 'deadball' || 'jumpball' || 'technical' || 'flagrant' || 'doublefoul' || 'triplefoul' || 'unsportsmanlike' || 'disqualifying' || 'personal' || 'team' 
    
    const [violationInfo, setViolationInfo] = useState({
        violationType: '', // 'jumpball' || 'shotClockEnd' || 'halfCourtViolation' || 'backCourtViolation' || 'outOfBounds' || 'foul' || 'laneViolation' || 'doubleDribble' || 'travel' || 'threeSeconds' || 'fiveSeconds' || 'tenSeconds' || 'shotClockViolation' || 'illegalScreen' || 'offensiveGoaltending' || 'defensiveGoaltending' || 'kickedBall' || 'delayOfGame' || 'illegalDefense' || 'technical' || 'flagrant' || 'doublefoul' || 'triplefoul' || 'unsportsmanlike' || 'disqualifying' || 'personal' || 'team'
        player: '',
    });    
    
    const [foulInfo, setFoulInfo] = useState({
        foulPosition: '', // 'offensive' || 'defensive'
        foulClassification: '', // 'personal' || 'technical' || 'flagrant' || 'doublefoul' || 'triplefoul' || 'unsportsmanlike' || 'disqualifying'
        foulType: '', // 'charge' ... 
        player: '',
        playerFouled: '',
    });

    const [substitutionInfo, setSubstitutionInfo] = useState({
        playerReplaced: '',
        playerIn: '',
    });

    const [turnOverInfo, setTurnOverInfo] = useState({
        turnOverType: '', // 'personal' || 'team'
        player: '',
    });

    const [stealInfo, setStealInfo] = useState({
        stealType: '', // 'interception' || 'deflection' || 'strip'
        player: '',
    });

    const [assistInfo, setAssistInfo] = useState({
        assistType: '', // 'bouncepass' 
        player: '',
    });

    const [reboundInfo, setReboundInfo] = useState({
        reboundType: '', // 'offensive' || 'defensive' 
        player: '',
    });

    const [blockInfo, setBlockInfo] = useState({
        blockType: '', 
        player: '',
    });

    const [shotInfo, setShotInfo] = useState({
        shotType: '', // 'jumpshot' || 'dunk' || 'layup' || 'hookshot' || 'fadeaway' || 'alleyoop' || 'bankshot' || 'turnaround' || 'tipin' || 'putback' || 'stepback' || 'pullup' || 'floating' || 'fingerroll' || 'slamdunk' || 'jumpstep' || 'jumpfloat' || 'jumpfade' || 'jumpbank' || 'jumpturn' || 'jumpstep' || 'jumpfloat' || 'jumpfinger' || 'jumpslam' || 'jumpdunk' || 'jumpalley' || 'jumpbounce' || 'jumpputback' || 'jumpstepback' || 'jumpfloating' || 'jumpfingerroll' || 'jumpslamdunk' || 'jumpjumpstep' || 'jumpjumpfloat' || 'jumpjumpfade' || 'jumpjumpbank' || 'jumpjumpturn' || 'jumpjumpstep' || 'jumpjumpfloat' || 'jumpjumpfinger' || 'jumpjumpslam' || 'jumpjumpdunk' || 'jumpjumpalley' || 'jumpjumpbounce' || 'jumpjumpputback' || 'jumpjumpstepback' || 'jumpjumpfloating' || 'jumpjumpfingerroll' || 'jumpjumpslamdunk' || 'jumpjumpjumpstep' || 'jumpjumpjumpfloat' || 'jumpjumpjumpfade' || 'jumpjumpjumpbank' || 'jumpjumpjumpturn' || 'jumpjumpjumpstep' || 'jumpjumpjumpfloat' || 'jumpjumpjumpfinger' || 'jumpjumpjumpslam' || 'jumpjumpjumpdunk' || 'jumpjumpjumpalley' || 'jumpjumpjumpbounce' || 'jumpjumpjumpputback' || 'jumpjumpjumpstepback' || 'jumpjumpjumpfloating' || 'jumpjumpjumpfingerroll' || 'jumpjumpjumpslamdunk' || 'jumpjumpjumpjumpstep' || 'jumpjumpjumpjumpfloat' || 'jumpjumpjumpjumpfade' || 'jumpjumpjumpjumpbank' || 'jumpjumpjumpjumpturn' || 'jumpjumpjumpjumpstep' || 'jumpjumpjumpjumpfloat' || 'jumpjumpjumpjumpfinger' || 'jumpjumpjumpjumpslam' || 'jumpjumpjumpjumpdunk' || 'jumpjumpjumpjumpalley' || 'jumpjumpjumpjumpbounce' || 'jumpjumpjump
        x: null,
        y: null,
        distanceFromHoop: null,
        points:'',
        teamplayer:'',
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
        setPlayInfo({
            actionType: '', 
            teamOffence: '',
            changeOffence: null,
        });

        setViolationInfo({
            violationType: '', 
            player: '',
        });

        setFoulInfo({
            foulPosition: '', 
            foulClassification: '', 
            foulType: '', 
            player: '',
            playerFouled: '',
        });

        setSubstitutionInfo({
            playerReplaced: '',
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
            teamplayer: '',
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
        console.log(response.data.plays);
        setPlays(response.data.plays);
    };

    const calculatePoints = (x, y) => {  
        const HoopX = (team === 'home' && shotInfo.teamplayer === 'home' && 2642.5 || 
                team === 'home' && shotInfo.teamplayer === 'away' && 157.5 || 
                team === 'away' && shotInfo.teamplayer === 'away' && 2642.5 || 
                team === 'away' && shotInfo.teamplayer === 'home' && 157.5
        ); // Coordenadas X del aro en función del equipo  
        const threePointLineRadius = 6.75; // Radio de la línea de tres puntos en mm (convertido a unidades de SVG)  
        
        // Distancia desde el aro del equipo atacante 
        const distanceFromHoop = (Math.sqrt((x - HoopX) ** 2 + (y - 750) ** 2)/100).toFixed(2);
        
        // Condiciones para 2 puntos (verificar si el tiro es dentro de las zonas de 2 puntos)  
        const isInTwoPointZone = (team === 'home' && shotInfo.teamplayer === 'away' && x <= 299 && y >= 90 && y <= 1410) ||  
                                (team === 'away' && shotInfo.teamplayer === 'home' && x <= 299 && y >= 90 && y <= 1410) || 
                                (team === 'away' && shotInfo.teamplayer === 'away' && x >= 2501 && y >= 90 && y <= 1410) ||   
                                (team === 'home' && shotInfo.teamplayer === 'home' && x >= 2501 && y >= 90 && y <= 1410) ||   
                                (team === 'away' && shotInfo.teamplayer === 'away' && x < 2501 && distanceFromHoop < threePointLineRadius) ||
                                (team === 'home' && shotInfo.teamplayer === 'home' && x > 299 && distanceFromHoop < threePointLineRadius) ||
                                (team === 'home' && shotInfo.teamplayer === 'away' && x > 299 && distanceFromHoop < threePointLineRadius) ||
                                (team === 'away' && shotInfo.teamplayer === 'home' && x < 2501 && distanceFromHoop < threePointLineRadius)
        ;
        const points = isInTwoPointZone ? 2 : 3; // Calcular los puntos del tiro
        // Agregar la nueva posición de clic al estado 
        setShotInfo({ ...shotInfo, x, y, points, distanceFromHoop, });
    };   

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setShotInfo({
            ...shotInfo,
            [name]: type === 'checkbox' ? checked : value
        });
        // const { name, value, type, checked } = event.target;
        // if (name in playInfo) {
        //     setPlayInfo({
        //         ...playInfo,
        //         [name]: type === 'checkbox' ? checked : value
        //     });
        // } else if (name in violationInfo) {
        //     setViolationInfo({
        //         ...violationInfo,
        //         [name]: value
        //     });
        // } else if (name in foulInfo) {
        //     setFoulInfo({
        //         ...foulInfo,
        //         [name]: value
        //     });
        // } else if (name in substitutionInfo) {
        //     setSubstitutionInfo({
        //         ...substitutionInfo,
        //         [name]: value
        //     });
        // } else if (name in turnOverInfo) {
        //     setTurnOverInfo({
        //         ...turnOverInfo,
        //         [name]: value
        //     });
        // } else if (name in stealInfo) {
        //     setStealInfo({
        //         ...stealInfo,
        //         [name]: value
        //     });
        // } else if (name in assistInfo) {
        //     setAssistInfo({
        //         ...assistInfo,
        //         [name]: value
        //     });
        // } else if (name in reboundInfo) {
        //     setReboundInfo({
        //         ...reboundInfo,
        //         [name]: value
        //     });
        // } else if (name in blockInfo) {
        //     setBlockInfo({
        //         ...blockInfo,
        //         [name]: value
        //     });
        // } else if (name in shotInfo) {
        //     setShotInfo({
        //         ...shotInfo,
        //         [name]: type === 'checkbox' ? checked : value
        //     });
        // }
    };

    const handleTeamChange = (event) => {
        setTeam(event.target.value);
    };

    const handleTeamPlayerChange = (event) => {
        setTeamPlayer(event.target.value);
        setShotInfo({
            ...shotInfo,
            teamplayer: event.target.value
        });
    };

    const handleLocalSelect = (value) => {  
        setSelectedLocals((prev) =>  
            prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]  
        );        
        setShotInfo({
            ...shotInfo,
            player: value
        });
    };  

    const handleAwaySelect = (value) => {  
        setSelectedAways((prev) =>  
            prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]  
        );
        setShotInfo({
            ...shotInfo,
            player: value
        });
    };  

    const handleSubmit = async (event) => {
        event.preventDefault();
        shotInfo.made ? addPoints(shotInfo.teamplayer, shotInfo.points) && 
            shotInfo.teamplayer === 'home' ? playInfo.homeScore += shotInfo.points : playInfo.awayScore += shotInfo.points : '' ;
        const newPlay = {
            ...playInfo,
            ...shotInfo,
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
        // Reinicia el formulario
        resetAllStates();
        setTeamPlayer([]);  
        setSelectedLocals([]);  
        setSelectedAways([]);  
    };

    
    const handleCourtClick = (event) => {    
        const svg = event.currentTarget;
        const rect = svg.getBoundingClientRect();
        
        // // Calcular las coordenadas en relación al SVG  
        const x = (event.clientX - rect.left) * (svg.viewBox.baseVal.width / rect.width);  
        const y = (event.clientY - rect.top) * (svg.viewBox.baseVal.height / rect.height);  

        if (shotInfo.teamplayer && shotInfo.player) {
            calculatePoints(x, y);
        }
    };

    return (
        <div className="court-container">
            {controller === true && (
                <div>
                    <div>
                        <label>Equipo ofensiva derecha: </label>
                        <select value={team} onChange={handleTeamChange}>
                            <option value="home">Home</option>
                            <option value="away">Away</option>
                        </select>
                    </div>
                    <div>
                        <label>Seleccione equipo de tiro: </label>
                        <label style={{ marginRight: '10px' }}><input type="radio" name="teamPlayer" value="home" checked={teamPlayer==='home'} onChange={handleTeamPlayerChange}/>Home</label>
                        <label style={{ marginRight: '10px' }}><input type="radio" name="teamPlayer" value="away" checked={teamPlayer==='away'} onChange={handleTeamPlayerChange} />Away</label>
                        <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '10px' }}>  
                            {[1, 2, 3, 4, 5].map(value => (  
                                <label key={value} style={{ display: 'flex', alignItems: 'center' }}>  
                                    <input  
                                        type="radio"
                                        name="player"  
                                        value={value}  
                                        checked={teamPlayer === 'home' && selectedLocals.includes(value)}  
                                        onChange={() => handleLocalSelect(value)}  
                                        disabled={teamPlayer !== 'home'}  
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
                                        checked={teamPlayer === 'away' && selectedAways.includes(value)}  
                                        onChange={() => handleAwaySelect(value)}  
                                        disabled={teamPlayer !== 'away'}  
                                    />  
                                    {value}  
                                </label>  
                            ))}  
                        </div>
                    </div>
                </div>
            )}
            <svg className="court" viewBox={viewBox} onClick={controller ? handleCourtClick : null} width="100%" height="100%">                
                
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
            {controller=== true && shotInfo.x !== null && shotInfo.y !== null && shotInfo.teamplayer !== null && shotInfo.player !== null &&(
                <form className="shot-form" onSubmit={handleSubmit}>
                    <h3>Detalles del Tiro</h3>
                    <label>Equipo: {shotInfo.teamplayer}</label>
                    <label>Jugador: {shotInfo.player}</label>
                    <label>Tiro de: {shotInfo.points} puntos</label>
                    <label>Distancia: {shotInfo.distanceFromHoop} metros</label>
                    <label>¿Tiro Exitoso? <input type="checkbox" name="made" checked={shotInfo.made} onChange={handleInputChange} /></label>
                    {shotInfo.made && (
                        <label>
                            Asistente: 
                            <input
                                type="text"
                                name="assistplayer"
                                value={shotInfo.assistplayer}
                                onChange={handleInputChange}
                            />
                        </label>
                    )}
                    {shotInfo.player && shotInfo.teamplayer && shotInfo.points && (<button type="submit">Registrar Tiro</button>)}
                </form>
            )}

            <div className="plays-list">
                <h3>Tiros Registrados</h3>
                <ul>
                    
                    {plays && plays.map((play, index) => (
                        <li key={index}>
                            {play.matchPlays}/{play.periodPlay} H {play.homeScore} - {play.awayScore} A, {play.period}-{play.time}-{play.shotClockTime}, Equipo: {play.teamplayer}, Jugador: {play.player}, {play.made ? 'Tiro Exitoso' : 'Tiro Fallido'}{play.made && play.assisted ? ', Asistente:' + play.assistplayer : ''}, Puntos: {play.points}, Posición: ({play.x}, {play.y})
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default BasketballCourt;
