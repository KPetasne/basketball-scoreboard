import React from 'react';
import axios from 'axios';
import './Team.css';

function Team({ name, score, fetchScore, controller, homeTeam, fouls, timeOuts, fetchFouls, fetchTimeOuts, fetchPosession }) {

    const teamName = () => {
        return name.toUpperCase();
    }
    
    const addPoints = async (team, points) => {
        await axios.post('/score', { team, points });
        fetchScore();
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

    return (
        <div className="team-container">
            <div className='name'>{teamName()}</div>
            <div className="time-outs">{timeOuts}</div>
            <div className="score">{score}</div>
            <div className="fouls">{fouls}</div>  
                
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