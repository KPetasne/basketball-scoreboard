import React, { useState } from 'react';

const BasketballCourt = ({controller, teamRight, playInfo, shotInfo, setShotInfo}) => {
    
    const [viewBox, setViewBox] = React.useState("0 0 2800 1500"); 

    const calculatePoints = (posx, posy) => {  
        const HoopX = (teamRight === 'home' && playInfo.teamOffence === 'home' && 2642.5 || 
            teamRight === 'home' && playInfo.teamOffence === 'away' && 157.5 || 
            teamRight === 'away' && playInfo.teamOffence === 'away' && 2642.5 || 
            teamRight === 'away' && playInfo.teamOffence === 'home' && 157.5
        ); // Coordenadas X del aro en función del equipo  
        const threePointLineRadius = 6.75; // Radio de la línea de tres puntos en mm (convertido a unidades de SVG)  
        
        // Distancia desde el aro del equipo atacante 
        const distanceFromHoop = (Math.sqrt((posx - HoopX) ** 2 + (posy - 750) ** 2)/100).toFixed(2);
        
        // Condiciones para 2 puntos (verificar si el tiro es dentro de las zonas de 2 puntos)  
        const isInTwoPointZone = (teamRight === 'home' && playInfo.teamOffence === 'away' && posx <= 299 && posy >= 90 && posy <= 1410) ||  
                                (teamRight === 'away' && playInfo.teamOffence === 'home' && posx <= 299 && posy >= 90 && posy <= 1410) || 
                                (teamRight === 'away' && playInfo.teamOffence === 'away' && posx >= 2501 && posy >= 90 && posy <= 1410) ||   
                                (teamRight === 'home' && playInfo.teamOffence === 'home' && posx >= 2501 && posy >= 90 && posy <= 1410) ||   
                                (teamRight === 'away' && playInfo.teamOffence === 'away' && posx < 2501 && distanceFromHoop < threePointLineRadius) ||
                                (teamRight === 'home' && playInfo.teamOffence === 'home' && posx > 299 && distanceFromHoop < threePointLineRadius) ||
                                (teamRight === 'home' && playInfo.teamOffence === 'away' && posx > 299 && distanceFromHoop < threePointLineRadius) ||
                                (teamRight === 'away' && playInfo.teamOffence === 'home' && posx < 2501 && distanceFromHoop < threePointLineRadius)
        ;
        const points = isInTwoPointZone ? 2 : 3; // Calcular los puntos del tiro
        // Agregar la nueva posición de clic al estado 
        setShotInfo({ ...shotInfo, posx, posy, points, distanceFromHoop, });
    };   

    const handleCourtClick = (event) => {
        console.log('prueba 1');
        const svg = event.currentTarget;
        const rect = svg.getBoundingClientRect();
        
        // // Calcular las coordenadas en relación al SVG  
        const x = (event.clientX - rect.left) * (svg.viewBox.baseVal.width / rect.width);  
        const y = (event.clientY - rect.top) * (svg.viewBox.baseVal.height / rect.height);  

        if (playInfo.teamOffence && shotInfo.shotPlayer) {
            calculatePoints(x, y);
        }
        console.log("handleCourtClick: " + JSON.stringify(shotInfo, null, 2));
    };

    return (
        <svg className="court" viewBox={viewBox} onClick={controller && (shotInfo.fouled || (playInfo.actionType === 'shot' && shotInfo.shotPlayer !== '')) ? handleCourtClick : null} width="100%" height="100%">                
            
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

            {controller === true && shotInfo.posx !== null && shotInfo.posy !== null && (
                <g>
                    {/* Línea diagonal de la "X" */}
                    <line
                        x1={shotInfo.posx - 15}
                        y1={shotInfo.posy - 15}
                        x2={shotInfo.posx + 15}
                        y2={shotInfo.posy + 15}
                        stroke="red"
                        strokeWidth="5"
                    />
                    {/* Línea diagonal opuesta de la "X" */}
                    <line
                        x1={shotInfo.posx + 15}
                        y1={shotInfo.posy - 15}
                        x2={shotInfo.posx - 15}
                        y2={shotInfo.posy + 15}
                        stroke="red"
                        strokeWidth="5"
                    />
                </g>
            )}
            {/* Renderizar las marcas X donde se hizo clic */}  
            {/* {clicks.map((click, index) => (  
                <text key={index} x={click.posx} y={click.posy} fill="red" fontSize="30">X</text>  
            ))}   */}
                                
        </svg>
    )

} 

export default BasketballCourt