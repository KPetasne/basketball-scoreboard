const constScoreService = require('../services/scoreService.js');
const constTimerService = require('../services/timerService.js');
const constShotClockService = require('../services/shotClockService.js');
const constFoulService = require('../services/foulService.js');
const constTimeOutService = require('../services/timeOutService.js');
const constPosessionService = require('../services/posessionService.js');
const constants = require('../services/constants.js');


let period = 1;
let periodHomeScore = 0;
let periodAwayScore = 0;
let periodHomeFouls = 0;
let periodAwayFouls = 0;
let halfHomeTimeOuts = 0;
let halfAwayTimeOuts = 0;
let periodPlay = 0;
let periodOffence = 0;

const resetPeriod = () => {
    period = 1;
    periodHomeScore = 0;
    periodAwayScore = 0;
    periodHomeFouls = 0;
    periodAwayFouls = 0;
    halfHomeTimeOuts = 0;
    halfAwayTimeOuts = 0;
    periodPlay = 0;
    periodOffence = 0;
};

const getPeriodInfo = () => {
    return {periodPlay,
            periodOffence,
            periodHomeScore,
            periodAwayScore,
            periodHomeFouls,
            periodAwayFouls,
            halfHomeTimeOuts,
            halfAwayTimeOuts,
            period
    };
}

const postPeriodInfo = (play) => {
    periodHomeScore = play.homeScore;
    periodAwayScore = play.awayScore;
    periodHomeFouls = play.homeFouls;
    periodAwayFouls = play.awayFouls;
    halfHomeTimeOuts = play.homeTimeOuts;
    halfAwayTimeOuts = play.awayTimeOuts;
    periodPlay = play.periodPlay;
    periodOffence = play.periodOffence;
}

const getPeriod = (req, res) => {
    res.json({ period: period });
};

const postPeriod = (req, res) => {
    if (period < 4){
        period++;
        if (period ===3){
            constTimeOutService.resetTimeOut(3);
            halfHomeTimeOuts = 0;
            halfAwayTimeOuts = 0;
        }
        constFoulService.resetFoul();
        constTimerService.resetTimer();
        constShotClockService.resetShotClockDefault(constants.LONG_SHOTCLOCK);    
        periodHomeScore = 0;
        periodAwayScore = 0;
        periodHomeFouls = 0;
        periodAwayFouls = 0; 
    }
    res.json({ home: constScoreService.homeScore, away: constScoreService.awayScore, time: constTimerService.remainingTime, shotClockTime: constShotClockService.shotClockTime, period: period, posession: constPosessionService.posession, homeFouls: constFoulService.homeFouls, awayFouls: constFoulService.awayFouls, homeTimeOuts: constTimeOutService.homeTimeOuts, awayTimeOuts: constTimeOutService.awayTimeOuts });
};

module.exports ={
    getPeriod,
    postPeriod,
    resetPeriod,
    getPeriodInfo,
    postPeriodInfo
};
