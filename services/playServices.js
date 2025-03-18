const PeriodService = require('../services/periodService.js');
const ScoreService = require('../services/scoreService.js');
const TimerService = require('../services/timerService.js');
const ShotClockService = require('../services/shotClockService.js');
const constants = require('../services/constants.js');
const { v4: uuidv4 } = require('uuid'); 
const { prettyDOM } = require('@testing-library/react');


let plays = [];
let matchPlays = 0; // total de jugadas en el partido
let matchOffence = 0; // ante nueva ofensiva luego de tiro, perdida o fin de posesion

const resetPlays = () => {
    plays = [];
    matchPlays = 0;
    matchOffence = 0;
};

const getPlay = (req, res) => {
    res.json({plays: plays});
};

const postPlay = (req, res) => {
    const { play } = req.body;
    const timestamp = new Date();
    const periodInfo = PeriodService.getPeriodInfo();
    matchPlays++;
    PeriodService.periodPlay++;
    play.continueOffence ? matchOffence : matchOffence++ && PeriodService.periodOffence++;
    
    //analizar que paso con la jugada. sumar a las variables y devolver
    PeriodService.postPeriodInfo(play);
    const currentScore = ScoreService.currentScore();
    const newPlay = {
        ...play,
        id: uuidv4(),
        matchPlays,
        periodPlay: periodInfo.periodPlay,
        matchOffence,
        periodOffence: periodInfo.periodOffence,
        timestamp,
        periodHomeScore: periodInfo.periodHomeScore,
        periodAwayScore: periodInfo.periodAwayScore,
        periodHomeFouls: periodInfo.periodHomeFouls,
        periodAwayFouls: periodInfo.periodAwayFouls,
        halfHomeTimeOuts: periodInfo.halfHomeTimeOuts,
        halfAwayTimeOuts: periodInfo.halfAwayTimeOuts,
        period: periodInfo.period,
        time: TimerService.remainingTimeActive(),
        shotClockTime: ShotClockService.remainingShotClockTimeActive(),
        homeScore: currentScore.home,
        awayScore: currentScore.away
    };

    // Agregar jugada al array
    plays.push(newPlay);
    console.log(plays);
    res.json({plays: plays});
}

module.exports ={
    getPlay,
    postPlay,
    resetPlays,
};
