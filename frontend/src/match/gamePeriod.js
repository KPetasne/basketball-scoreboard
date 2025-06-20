import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { INTERVAL_MS } from './gameConstants.js';

const GamePeriod = ({ fetchPeriod, controller, period }) => {  

    useEffect(() => {
        fetchPeriod;
        const interval = setInterval(() => {
            fetchPeriod;
        }, INTERVAL_MS); // cada una decima de segundo actualiza la informacion
        return () => clearInterval(interval);
    }, [fetchPeriod]);
    
    const newPeriod = async () => {
        await axios.post('/period');
    };

    return (
        <div className="period-container">
            <div className="period">{period}</div>
            {controller === true && (
            <div className="controls">
                <button onClick={newPeriod}>New</button>
            </div>
            )}
        </div>
    );
};

export default GamePeriod;
