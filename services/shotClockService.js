import { clear } from '@testing-library/user-event/dist/clear.js';
import { INTERVAL_MS, LONG_SHOTCLOCK, SHORT_SHOTCLOCK } from './constants.js';
import { matchTimer,remainingTime } from './timerService.js';

let shotClockTime = LONG_SHOTCLOCK;
let shotClockTimer = null;

// const resetShotClockDefault = () => {
//     shotClockTime = LONG_SHOTCLOCK;
//     shotClockTimer = null;
//     clearInterval(shotClockTimer);
//     res.json({ shotClockTime: shotClockTime });
// };

const updateShotClock = () => {
    if (shotClockTime > 0) {
        shotClockTime -= INTERVAL_MS;
    } else {
        if (!matchTimer) {
            clearInterval(shotClockTimer);
            shotClockTimer = null;
        }
    }
};

const getShotClock = (req, res) => {
    res.json({ shotClockTime: shotClockTime });
};

const startShotClock = (req, res) => {
    if (!shotClockTimer) {
        shotClockTimer = setInterval(updateShotClock, INTERVAL_MS);
    }
    res.json({ shotClockTime: shotClockTime });
};

const stopShotClock = (req, res) => {
    if (shotClockTimer) {
        clearInterval(shotClockTimer);
        shotClockTimer = null;
    }
    res.json({ shotClockTime: shotClockTime });
};

const resetShotClock = (req, res) => {
    if (remainingTime <= LONG_SHOTCLOCK) {
        clearInterval(shotClockTimer);
        shotClockTimer = null;
        shotClockTime = "-1";
    } else {
        shotClockTime = LONG_SHOTCLOCK;
        if (!shotClockTimer && matchTimer) {
            shotClockTimer = setInterval(updateShotClock, INTERVAL_MS);
        }
    }
    res.json({ shotClockTime: shotClockTime });
};

const resetShotClockShort = (req, res) => {
    if (remainingTime <= SHORT_SHOTCLOCK) {
        clearInterval(shotClockTimer);
        shotClockTimer = null;
        shotClockTime = "-1";
    } else {
        shotClockTime = SHORT_SHOTCLOCK;
        if (!shotClockTimer && matchTimer) {
            shotClockTimer = setInterval(updateShotClock, INTERVAL_MS);
        }
    }
    res.json({ shotClockTime: shotClockTime });
};

export  {
    // resetShotClockDefault,
    getShotClock,
    startShotClock,
    stopShotClock,
    resetShotClock,
    resetShotClockShort,
    shotClockTimer,
    shotClockTime,
    updateShotClock
};