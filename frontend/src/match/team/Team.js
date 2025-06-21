import React from 'react';
import axios from 'axios';
import './Team.css';
import PlayersStatistics from '../views/pleyerStatistics';

function Team({ name, score, addPoints, controller, homeTeam, fouls, timeOuts, fetchFouls, fetchTimeOuts, fetchPosession, teamscoreboard }) {

    const teamName = () => {
        return name.toUpperCase();
    }

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

    // Ejemplo de uso
    // const players = [
    //     { name: 'Player 1', points: 15, rebounds: 5, assists: 7, fouls: 2 },
    //     { name: 'Player 2', points: 10, rebounds: 6, assists: 3, fouls: 4 },
    //     { name: 'Player 3', points: 8, rebounds: 4, assists: 2, fouls: 3 },
    //     { name: 'Player 4', points: 15, rebounds: 1, assists: 1, fouls: 2 },
    //     // Agrega más jugadores según sea necesario
    // ];
    
    return (
        <div className="team-container">
            {teamscoreboard === true && (                
                // <div className="statistics-panel">
                //     {players.map((player, index) => (
                //         <div key={index} className="player">
                //             <div className="playername">{player.name}</div>
                //             <div className="playerpoints">Points: {player.points}</div>
                //             <div className="playerrebounds">R: {player.rebounds}</div>
                //             <div className="playerassists">A: {player.assists}</div>
                //             <div className="playerfouls">{player.fouls}</div>
                //         </div>
                //     ))}
                // </div>
                <PlayersStatistics teamname={name} />
            )}
            {teamscoreboard === false && (
                <div className="team">
                    <div className='name'>{teamName()}</div>
                    <div className="time-outs">{timeOuts}</div>
                    <div className="score">{score}</div>
                    <div className="fouls">{fouls}</div>  
                </div>
            )}
            {controller === true && (
                <div>
                    <div className="controls"> 
                        <button onClick={() => addPoints(name, 1)}>Add 1 Point</button>
                        <button onClick={() => addPoints(name, 2)}>Add 2 Points</button>
                        <button onClick={() => addPoints(name, 3)}>Add 3 Points</button>
                        <button onClick={() => addPoints(name, -1)}>- 1 Point</button>
                    </div>
                    <div className="controls"> 
                        <button onClick={() => postFouls(name, 1)}>Add 1 Foul</button>
                        <button onClick={() => postFouls(name, -1)}>- 1 Foul</button>
                        <button onClick={() => postTimeOut(name, 1)}>Time Out</button>
                        <button onClick={() => postPosession(name, homeTeam)}>Posession</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Team;