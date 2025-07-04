const constants = require('../model/constants.js');
const constShotClockService = require('./shotClockService.js');

let matchTimer = null;
let remainingTime = constants.TEN_MINUTES; // 10 minutos

const clearTimer = () => {
    clearInterval(matchTimer);
    matchTimer = null;
}

const resetTimer = () => {
    remainingTime = constants.TEN_MINUTES; // 10 minutos
    clearTimer();
};

const updateTime = () => {
    if (remainingTime > 0) {
        remainingTime -= constants.INTERVAL_MS;
    } else {
        clearTimer();
        constShotClockService.shotClockClear();
    }
};

const startTimer = (req, res) => {
    if (!matchTimer) {
        matchTimer = setInterval(updateTime, constants.INTERVAL_MS);
    }
    res.json({ time: remainingTime });
};

const stopTimer = (req, res) => {
    if (matchTimer) {
        clearTimer();
    }
    res.json({ time: remainingTime });
};

const getTime = (req, res) => {
    res.json({ time: remainingTime });
};

const isMatchTimerActive = () => {
    return matchTimer !== null;
};

const remainingTimeActive = () => {
    return remainingTime;
};

module.exports = {
    resetTimer,
    updateTime,
    startTimer,
    stopTimer,
    getTime,
    isMatchTimerActive,
    remainingTimeActive
};