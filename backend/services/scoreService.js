const { remainingTimeActive } = require("./timerService");
const {GAME_SETTINGS} = require("../model/constants")
const { v4: uuidv4 } = require('uuid');

let homeLeadTime = 0; // Tiempo en el que homeScore estuvo arriba
let awayLeadTime = 0; // Tiempo en el que awayScore estuvo arriba
let leadChanges = 0; // Cantidad de cambios de líder
let lastLeader = ''; // Último líder marcador
let ties = 0; // Cantidad de veces empatados
let startTime = Date.now(); // Tiempo de inicio

//nuevo
const updateScore = (currentGame, gameAction) => {
    const actualLeader = getLastLeader(currentGame);

    let currentTeam = currentGame[gameAction.team];
    const newTeamScore = currentTeam.score + gameAction.data.points;
    currentTeam.score = newTeamScore

    const home = (gameAction.team == GAME_SETTINGS.TEAMS.HOME) ? currentTeam : currentGame.home;
    const away = (gameAction.team == GAME_SETTINGS.TEAMS.AWAY) ? currentTeam : currentGame.away;

    let newGame = currentGame;

    newGame.home = home;
    newGame.away = away;

    const newLeader = getLastLeader(newGame);
    
    let events = [];

    if (newLeader != actualLeader) {
        const changeLeaderEvent = {
            id: uuidv4(),
            type: GAME_SETTINGS.LEADER.CHANGE_EVENT,
            leader: newLeader
        }

        events.push(changeLeaderEvent);
    }

    const action = {
        id: uuidv4(),
        type: gameAction.type,
        team: gameAction.team,
        time: gameAction.time,
        period: gameAction.period,
        points: gameAction.data.points,
        events: events
    }
    newGame.actions.push(action);


    return newGame
}

const getLastLeader = (currentGame) => {
    const homeScore = currentGame.home.score;
    const awayScore = currentGame.away.score;

    let leader = GAME_SETTINGS.LEADER.TIE;

    if (homeScore > awayScore) {
        leader = GAME_SETTINGS.TEAMS.HOME;
    } else if (awayScore > homeScore) {
        leader = GAME_SETTINGS.TEAMS.AWAY;
    }

    return leader;
}

const getLeaderData = (currentGame) => {
    const changeLeaderActions = currentGame.actions
        .filter((action) => 
            action.events
                .filter((e) =>
                    e.type = GAME_SETTINGS.LEADER.CHANGE_EVENT
                ).length > 0
        ).flatMap((action) => {
            const changeLeaderEvent = action.filter((e) => e.type = GAME_SETTINGS.LEADER.CHANGE_EVENT);
            return {
                ...action,
                "leader": changeLeaderEvent.leader
            }
        });
    
    return getLeaderByTimeAndPeriods(changeLeaderActions);
}

function getLeaderByTimeAndPeriods(actions) {
    const resultado = {};
  
    for (const { leader, time, period } of actions) {
      if (!resultado[leader]) {
        resultado[leader] = {};
      }
  
      if (!resultado[leader][period]) {
        resultado[leader][period] = 0;
      }
  
      resultado[leader][period] += time;
    }
  
    return resultado;
  }



module.exports = {
    updateScore,
    getLastLeader,
    getLeaderData
};