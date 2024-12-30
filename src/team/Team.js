import React from 'react';
import './Team.css'

function Team({ name, score, addPoints, controller, homeTeam, fouls, timeOuts, postFouls, postTimeOut, postPosession }) {

    const teamName = () => {
        return name.toUpperCase();
    }
    
    return (
        <div className="team">
            {homeTeam === true && (
                <div>
                    <div className='name'>{teamName()}</div>
                    <div className="fouls">{fouls}</div>
                    <div className="score">{score}</div>
                    <div className="time-outs">{timeOuts}</div>
                </div>
            )}
            {homeTeam === false && (
                <div>
                    <div className="fouls">{fouls}</div>
                    <div className='name'>{teamName()}</div>
                    <div className="time-outs">{timeOuts}</div>
                    <div className="score">{score}</div>
                </div>
            )}
            {controller === true && (
                <div>
                    <div> 
                        <button onClick={() => addPoints(name, 1)}>Add 1 Point</button>
                        <button onClick={() => addPoints(name, 2)}>Add 2 Points</button>
                        <button onClick={() => addPoints(name, 3)}>Add 3 Points</button>
                        <button onClick={() => addPoints(name, -1)}>- 1 Point</button>
                    </div>
                    <div> 
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