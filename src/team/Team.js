import React from 'react';
import './Team.css'

function Team({ name, score, addPoints }) {

    const teamName = () => {
        return name.toUpperCase();
    }

    return (
        <div className="team">
            <h1 className='name'>{teamName()}</h1>
            <div className="score">{score}</div>
            <button onClick={() => addPoints(name, 1)}>Add 1 Point</button>
            <button onClick={() => addPoints(name, 2)}>Add 2 Points</button>
            <button onClick={() => addPoints(name, 3)}>Add 3 Points</button>
        </div>
    );
}

export default Team;