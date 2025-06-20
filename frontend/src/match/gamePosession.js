import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { INTERVAL_MS } from './gameConstants.js';

const GamePosession = ({ fetchPosession, controller, homePosession, awayPosession}) => {  

    useEffect(() => {
        fetchPosession;
        const interval = setInterval(() => {
            fetchPosession;
        }, INTERVAL_MS); // cada una decima de segundo actualiza la informacion
        return () => clearInterval(interval);
    }, [fetchPosession]);

    return (
        <div className="posession-container">
            <div className="posession">
            {controller === "home" && (
                homePosession
            )}
            {controller === "away" && (
                awayPosession
            )}
            </div>
        </div>
    );
};

export default GamePosession;
