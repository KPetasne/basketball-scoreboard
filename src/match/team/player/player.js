import React from 'react';
import axios from 'axios';
import './player.css';

function Players({ teamname }) {

    // Ejemplo de uso
    const players = [
        { number: 12, name: 'MDK', points: 15, rebounds: 5, assists: 7, fouls: 2 },
        { number: 23, name: 'MADEKA', points: 10, rebounds: 6, assists: 3, fouls: 4 },
        { number: 6, name: 'MK', points: 8, rebounds: 4, assists: 2, fouls: 3 },
        { number: 9, name: 'MARTIN', points: 15, rebounds: 1, assists: 1, fouls: 2 },
        { number: 21, name: 'KRASNY', points: 15, rebounds: 1, assists: 1, fouls: 2 },
        { number: 12, name: 'MDK', points: 15, rebounds: 5, assists: 7, fouls: 2 },
        { number: 23, name: 'MADEKA', points: 10, rebounds: 6, assists: 3, fouls: 4 },
        { number: 6, name: 'MK', points: 8, rebounds: 4, assists: 2, fouls: 3 },
        { number: 9, name: 'MARTIN', points: 15, rebounds: 1, assists: 1, fouls: 2 },
        { number: 21, name: 'KRASNY', points: 15, rebounds: 1, assists: 1, fouls: 2 },
        { number: 12, name: 'MDK', points: 15, rebounds: 5, assists: 7, fouls: 2 },
        { number: 23, name: 'MADEKA', points: 10, rebounds: 6, assists: 3, fouls: 4 },
        { number: 6, name: 'MK', points: 8, rebounds: 4, assists: 2, fouls: 3 },
        { number: 9, name: 'MARTIN', points: 15, rebounds: 1, assists: 1, fouls: 2 },
        { number: 21, name: 'KRASNY', points: 15, rebounds: 1, assists: 1, fouls: 2 },
        // Agrega más jugadores según sea necesario
    ];
    
    return (      
        <div className="statistics-panel">
            <div className="playertitle">
                <div className="playernumber">N</div>
                <div className="playername">NAME</div>
                <div className="playerpoints">P</div>
                <div className="playerrebounds">R</div>
                <div className="playerassists">A</div>
                <div className="playerfouls">F</div>
            </div>
            {players.map((player, index) => (
                <div key={index} className="player">
                    <div className="playernumber">{player.number}</div>
                    <div className="playername">{player.name}</div>
                    <div className="playerpoints">{player.points}</div>
                    <div className="playerrebounds">{player.rebounds}</div>
                    <div className="playerassists">{player.assists}</div>
                    <div className="playerfouls">{player.fouls}</div>
                </div>
            ))}
        </div>
    );
}

export default Players;