import React from 'react';
import axios from 'axios';
import './playerStatistics.css';
import players from '../team/player/player';


function PlayersStatistics({ teamname }) {
    
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

export default PlayersStatistics;