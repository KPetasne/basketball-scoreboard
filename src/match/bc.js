
<div>
<div>
    {playInfo.actionType === "violation" && (
        <div>
            {/* Selector de Equipo de violacion si la misma es de tipo both */}
            <select
                value={playInfo.team}
                onChange={(e) => setPlayInfo({ ...playInfo, team: e.target.value })}
            >
                <option value="" disabled>Select Violation Team</option>                     
                <option value="home">Home</option>
                <option value="away">Away</option>
            </select>
            

            {/* Selector de Tipo de Violación */}
            {playInfo.team && (
                <select
                    value={violationInfo.violationType}
                    onChange={handleViolationChange()}
                >
                    <option value="" disabled>Select Violation Type</option>
                    {violationTypes
                        .filter(type => type.classification === playInfo.team || type.classification === 'both') // Excluir "offensive" o "defensive" según el equipo
                        .map((violation, index) => (
                        <option key={index} value={violation.value}>
                            {violation.label}
                        </option>
                    ))}
                </select>
            )}
            
            
        </div>
    )}
    {playInfo.actionType === "turnover" && (
        <div>
            {/* Selector de TurnOver Type */}
            <select
                value={turnOverInfo.turnOverType}
                onChange={handleTurnOverChange()}
            >
                <option value="" disabled>Select TurnOver Type</option>
                {/* Mostrar turnOverTypes que no sean de tipo "violation" */}
                {turnOverTypes
                    .filter(type => type.type !== "violation") // Excluir "violation"
                    .map((turnover, index) => (
                        <option key={index} value={turnover.value}>
                            {turnover.label}
                        </option>
                    ))}
            </select>
        </div>
    )}
    {playInfo.actionType === "shot" && (
        <select value={shotInfo.shotType} onChange={(e) => setShotInfo({...shotInfo, shotType: e.target.value})}>
            <option value="" disabled>Select Shot Type</option>
            {shotTypes.map((type, index) => (
                <option key={index} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)} {/* Capitaliza la primera letra */}
                </option>
            ))}
        </select>
    )}
</div>

<div
    style={{
        display: (playInfo.actionType === 'shot' || 
                playInfo.actionType === 'turnover' || 
                playInfo.actionType === 'substitution')
            ? 'flex' 
            : 'none',
        flexDirection: 'row',
        marginLeft: '10px',
    }}
>   
    {/* {[1, 2, 3, 4, 5].map(value => (  
        <label key={value} style={{ display: 'flex', alignItems: 'center' }}>  
            <input  
                type="radio"
                name="player"  
                value={value}  
                checked={playInfo.teamOffence === 'home' && selectedLocals.includes(value)}  
                onChange={() => handleLocalSelect(value)}  
                disabled={playInfo.teamOffence !== 'home' && (playInfo.actionType === 'shot' || playInfo.actionType === 'turnover' || playInfo.actionType === 'substitution')}  
            />  
            {value}  
        </label>  
    ))}  
    {[1, 2, 3, 4, 5].map(value => (  
        <label key={value} style={{ display: 'flex', alignItems: 'center' }}>  
            <input  
                type="radio"  
                name="player" 
                value={value}  
                checked={playInfo.teamOffence === 'away' && selectedAways.includes(value)}  
                onChange={() => handleAwaySelect(value)}  
                disabled={playInfo.teamOffence !== 'away' && (playInfo.actionType === 'shot' || playInfo.actionType === 'turnover' || playInfo.actionType === 'substitution')}  
            />  
            {value}  
        </label>  
    ))}   */}
    <select
        value={
            playInfo.actionType === 'shot' ? shotInfo.player :
            playInfo.actionType === 'turnover' ? turnOverInfo.player :
            playInfo.actionType === 'substitution' ? substitutionInfo.playerOut :
            ''
        } // Selecciona el valor correspondiente según el tipo de acción
        onChange={handlePlayerAction}
    >
        {filteredPlayers
            .filter(player => player.onCourt && player.team === playInfo.teamOffence)
            .map(player => (
                <option key={player.id} value={player.name}>
                    {player.name}
                </option>
            ))}
    </select>
    {playInfo.actionType === 'substitution' && substitutionInfo.playerOut && (
    <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '10px' }}>
        <label>Jugador que ingresa:
            <select value={substitutionInfo.playerIn} onChange={handleSubstitutionChange}>
                <option value="" disabled>Select Player In</option>
                {players
                    .filter(
                        (player) =>
                            player.team === playInfo.teamOffence && !player.onCourt // Filtrar solo los jugadores en el banco del equipo actual
                    )
                    .map((player) => (
                        <option key={player.id} value={player.name}>
                            {player.name}
                        </option>
                    ))}
            </select>
        </label>
    </div>
    )}
    {turnOverInfo.turnOverType === "steal" && (
        <div style={{ display: playInfo.actionType === 'turnover' && turnOverInfo.turnOverType  ? 'flex' : 'none', flexDirection: 'row', marginLeft: '10px' }}>
        {/* Selector de Steals si corresponde */}
            <select
                value={stealInfo.stealType}
                onChange={handleStealChange}
            >
                <option value="" disabled>Select Steal Type</option>
                {stealTypes.map((steal, index) => (
                    <option key={index} value={steal}>
                        {steal.label}
                    </option>
                ))}
            </select>
            <label>Jugador que ingresa:
            <select value={substitutionInfo.playerIn} onChange={handleSubstitutionChange}>
                <option value="" disabled>Select Player In</option>
                {players
                    .filter(
                        (player) =>
                            player.team === playInfo.teamOffence && !player.onCourt // Filtrar solo los jugadores en el banco del equipo actual
                    )
                    .map((player) => (
                        <option key={player.id} value={player.name}>
                            {player.name}
                        </option>
                    ))}
            </select>
        </label>
        </div>     
    )}
    {playInfo.actionType === 'violation' && violationInfo.violationType === 'foul' && (
        <div style={{ display:  'flex' , flexDirection: 'row', marginLeft: '10px' }}>
            <label>
                Clasificación de la Falta:
                <select
                    value={foulInfo.foulClassification}
                    onChange={(e) => setFoulInfo({...foulInfo, foulClassification: e.target.value})}
                >
                    <option value="" disabled>Select Classification</option>
                    {foulClassification.map((classification, index) => (
                        <option key={index} value={classification}>
                            {classification.charAt(0).toUpperCase() + classification.slice(1)}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Tipo de Falta:
                <select
                    value={foulInfo.foulType}
                    onChange={(e) => setFoulInfo({...foulInfo, foulType: e.target.value})}
                    disabled={!foulInfo.foulClassification} // Desactiva si no hay una clasificación seleccionada
                >
                    <option value="" disabled>Select Foul Type</option>
                    {foulTypes
                        .filter(foul => 
                            foul.classification === foulInfo.foulClassification || 
                            foul.classification === "both"
                        )
                        .map((foul, index) => (
                            <option key={index} value={foul.value}>
                                {foul.label}
                            </option>
                        ))}
                </select>
            </label>
            {(foulInfo.foulClassification !== "doubleFoul") && (
                <>
                    {/* Jugador que comete la falta */}
                    <label>
                        Jugador que hizo la falta:
                        <select
                            value={foulInfo.player}
                            onChange={(e) => setFoulInfo({ ...foulInfo, player: e.target.value })}
                        >
                            <option value="" disabled>Select Player</option>
                            {players[foulInfo.foulClassification === "offensive" ? playInfo.teamOffence : !playInfo.teamOffence].map((player, index) => (
                                <option key={index} value={player}>
                                    {player}
                                </option>
                            ))}
                        </select>
                    </label>
                    {foulInfo.foulClassification === 'defensive' && foulInfo.player && (
                        <label>
                            Fue en accion de tiro:
                            <input type="checkbox" name="fouled" checked={foulInfo.onShot} onChange={handleInputFoulChange} />
                        </label>
                    )}
                    {/* Jugador afectado */}
                    {foulInfo.player && foulInfo.onShot !== null && (
                        <label>
                            Jugador que recibió la falta:
                            <select
                                value={foulInfo.playerFouled}
                                onChange={handleFoulChange}
                            >
                                <option value="" disabled>Select Player</option>
                                {players[foulInfo.foulClassification === "offensive" ? !playInfo.teamOffence : playInfo.teamOffence].map((player, index) => (
                                    <option key={index} value={player}>
                                        {player}
                                    </option>
                                ))}
                            </select>
                        </label>
                    )}
                </>
            )}
            {foulInfo.foulType === "doubleFoul" && (
                <>
                    <label>
                        Jugador del equipo 1:
                        <select
                            value={foulInfo.playerFouled}
                            onChange={(e) => setFoulInfo({ ...foulInfo, player: e.target.value })}
                        >
                            <option value="" disabled>Select Player 1</option>
                            {players[playInfo.teamOffence].map((player, index) => (
                                <option key={index} value={player}>
                                    {player}
                                </option>
                            ))}
                        </select>
                    </label>
                    {foulInfo.player && (
                        <label>
                            Jugador del equipo 2:
                            <select
                                value={foulInfo.playerFouled}
                                onChange={handleDoubleFoulChange}
                            >
                                <option value="" disabled>Select Player 2</option>
                                {players[!playInfo.teamOffence].map((player, index) => (
                                    <option key={index} value={player}>
                                        {player}
                                    </option>
                                ))}
                            </select>
                        </label>
                    )}
                </>
            )}
        </div>
    )}
</div>
</div>