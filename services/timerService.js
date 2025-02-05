import { INTERVAL_MS, TEN_MINUTES } from './constants.js';
import { shotClockTimer, updateShotClock, shotClockTime } from './shotClockService.js';

let matchTimer = null;
let remainingTime = TEN_MINUTES; // 10 minutos

// const resetTimer = () => {
//     matchTimer = null;
//     remainingTime = TEN_MINUTES; // 10 minutos
//     res.json({ time: remainingTime });
// };

const updateTime = () => {
    if (remainingTime > 0) {
        remainingTime -= INTERVAL_MS;
    } else {
        clearInterval(matchTimer);
        matchTimer = null;
        clearInterval(shotClockTimer);
        shotClockTimer = null;
    }
};

const startTimer = (req, res) => {
    if (!matchTimer) {
        matchTimer = setInterval(updateTime, INTERVAL_MS);
    }
    if (!shotClockTimer) {
        shotClockTimer = setInterval(updateShotClock, INTERVAL_MS);
    }
    res.json({ time: remainingTime, shotClockTime: shotClockTime });
};

const stopTimer = (req, res) => {
    if (matchTimer) {
        clearInterval(matchTimer);
        matchTimer = null;
    }
    res.json({ time: remainingTime });
};

const getTime = (req, res) => {
    res.json({ time: remainingTime });
};

export  {
    // resetTimer,
    updateTime,
    startTimer,
    stopTimer,
    getTime,
    matchTimer,
    remainingTime
};