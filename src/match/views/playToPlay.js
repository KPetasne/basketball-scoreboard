import React, { useState } from 'react';
import actionTypes from '../model/basketball/actionTypes';

const PlayToPlayTable = ({ formatTime, plays }) => {
    const [selectedQuarter, setSelectedQuarter] = useState('all');

    // Filtrar jugadas según el cuarto seleccionado
    const filteredPlays = plays.filter(
        (play) => selectedQuarter === 'all' || play.quarter === selectedQuarter
    );

    return (
        <div>
            {/* Selector de Cuarto */}
            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="quarter-select" style={{ marginRight: '10px' }}>Select Quarter:</label>
                <select
                    id="quarter-select"
                    value={selectedQuarter}
                    onChange={(e) => setSelectedQuarter(e.target.value)}
                >
                    <option value="all">All Quarters</option>
                    <option value="1">1st Quarter</option>
                    <option value="2">2nd Quarter</option>
                    <option value="3">3rd Quarter</option>
                    <option value="4">4th Quarter</option>
                </select>
            </div>

            {/* Tabla Play to Play */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '10px',
                    maxHeight: '300px',
                    overflowY: 'scroll',
                    border: '1px solid #ccc',
                }}
            >
                <h2 style={{ gridColumn: '1 / span 3', textAlign: 'center' }}>Play to Play</h2>

                {/* Header */}
                <div style={{ textAlign: 'center', fontWeight: 'bold', borderBottom: '1px solid #ccc' }}>Home</div>
                <div style={{ textAlign: 'center', fontWeight: 'bold', borderBottom: '1px solid #ccc' }}>Time</div>
                <div style={{ textAlign: 'center', fontWeight: 'bold', borderBottom: '1px solid #ccc' }}>Away</div>

                {/* Contenido */}
                {filteredPlays.map((play, index) => (
                    <React.Fragment key={index}>
                        {/* Columna Home */}
                        <div style={{ textAlign: 'center', padding: '5px' }}>
                            {play.teamPlay === 'home' && (
                                <>
                                    <span> {play.actionType}</span>
                                    {actionTypes.filter(action => action.value === play.actionType).map(statKey => (
                                            statKey === 'stats' ? statKey.map((stat, skey) => 
                                                play[skey] && ( // Verifica si el valor está definido en el objeto `play`
                                                    <span key={stat}>
                                                        {play[skey]}
                                                    </span>
                                                )
                                            ) : ''
                                        ))
                                    }
                                </>
                            )}
                        </div>

                        {/* Columna Time */}
                        <div style={{ textAlign: 'center', padding: '5px', fontWeight: 'bold' }}>
                            {formatTime(play.time)}
                        </div>

                        {/* Columna Away */}
                        <div style={{ textAlign: 'center', padding: '5px' }}>
                            {play.teamPlay === 'away' && (
                                <>
                                    <span> {play.actionType}</span>
                                    {actionTypes.filter(action => action.value === play.actionType).map(statKey => (
                                            statKey === 'stats' ? statKey.map((stat, skey) => 
                                                play[skey] && ( // Verifica si el valor está definido en el objeto `play`
                                                    <span key={stat}>
                                                        {play[skey]}
                                                    </span>
                                                )
                                            ) : ''
                                        ))
                                    }
                                </>
                            )}
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default PlayToPlayTable;
