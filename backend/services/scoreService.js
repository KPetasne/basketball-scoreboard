const { remainingTimeActive } = require("./timerService");

let homeScore = 0;
let awayScore = 0;
let homeLeadTime = 0; // Tiempo en el que homeScore estuvo arriba
let awayLeadTime = 0; // Tiempo en el que awayScore estuvo arriba
let leadChanges = 0; // Cantidad de cambios de líder
let lastLeader = ''; // Último líder marcador
let ties = 0; // Cantidad de veces empatados
let startTime = Date.now(); // Tiempo de inicio

const resetScore = () => {
    homeScore = 0;
    awayScore = 0;
    homeLeadTime = 0;
    awayLeadTime = 0;
    leadChanges = 0;
    lastLeader = '';
    ties = 0;
    startTime = Date.now();
};

const currentScore = () => {
    return { 
        home: homeScore, 
        away: awayScore,
        homeLeadTime,
        awayLeadTime,
        leadChanges,
        lastLeader,
        ties };
}

const getScore = (req, res) => {
    const score = currentScore();
    res.json(score);
};

//viejo
const postScore = (req, res) => {
    const { team, points } = req.body;
    if (team === 'home') {
        if (points === -1 && homeScore > 0) {
            homeScore += points;
        } else {
            homeScore += points;
        }
    } else if (team === 'away') {
        if (points === -1 && awayScore > 0) {
            awayScore += points;
        } else {
            awayScore += points;
        }
    }
    // Actualizar tiempos de liderazgo
    if (homeScore > awayScore) {
        homeLeadTime += (remainingTimeActive() - startTime);
        if (lastLeader !== 'home') {
            leadChanges++;
            lastLeader = 'home';
        }
    } else if (awayScore > homeScore) {
        awayLeadTime += (remainingTimeActive() - startTime);
        if (lastLeader !== 'away') {
            leadChanges++;
            lastLeader = 'away';
        }
    } else {
        ties++;
        lastLeader = lastLeader || 'empate';
    }
    startTime = remainingTimeActive();

    res.json({ home: homeScore, away: awayScore });
};

//nuevo
const updateScore = (currentGame, gameAction) => {
    let currentTeam = currentGame[gameAction.team];
    const newTeamScore = currentTeam.score + gameAction.data.points;
    currentTeam.score = newTeamScore

    const home = (gameAction.team == 'HOME') ? currentTeam : currentGame.home;
    const away = (gameAction.team == 'AWAY') ? currentTeam : currentGame.away;

    const action = {
        id: "generar_rnd",
        type: gameAction.type,
        team: gameAction.team,
        time: gameAction.time,
        events: []
    }

    let newGame = currentGame;

    newGame.home = home;
    newGame.away = away;
    console.log(newGame);
    newGame.actions.push(action);

    return newGame
}


module.exports = {
    resetScore,
    getScore,
    postScore,
    currentScore,
    updateScore,
    homeScore,
    awayScore
};