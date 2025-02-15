const constScoreService = require('../services/scoreService.js');
const constTimerService = require('../services/timerService.js');
const constShotClockService = require('../services/shotClockService.js');
const constFoulService = require('../services/foulService.js');
const constTimeOutService = require('../services/timeOutService.js');
const constPosessionService = require('../services/posessionService.js');
const constants = require('../services/constants.js');


let period = 1;

const resetPeriod = () => {
    period = 1;
};

const getPeriod = (req, res) => {
    res.json({ period: period });
};

const postPeriod = (req, res) => {
    if (period < 4){
        period++;
        if (period ===3){
            constTimeOutService.resetTimeOut(3);
        }
        constFoulService.resetFoul();
        constTimerService.resetTimer();
        constShotClockService.resetShotClockDefault(constants.LONG_SHOTCLOCK);     
    }
    res.json({ home: constScoreService.homeScore, away: constScoreService.awayScore, time: constTimerService.remainingTime, shotClockTime: constShotClockService.shotClockTime, period: period, posession: constPosessionService.posession, homeFouls: constFoulService.homeFouls, awayFouls: constFoulService.awayFouls, homeTimeOuts: constTimeOutService.homeTimeOuts, awayTimeOuts: constTimeOutService.awayTimeOuts });
};

module.exports ={
    getPeriod,
    postPeriod,
    resetPeriod,
};
