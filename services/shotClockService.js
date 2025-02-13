const constants = require('./constants.js');
const constTimerService = require('./timerService.js');

let shotClockTime = constants.LONG_SHOTCLOCK;
let shotClockTimer = null;

const shotClockClear = () => {
    clearInterval(shotClockTimer);
    shotClockTimer = null;
}

const resetShotClockDefault = () => {
    shotClockTime = constants.LONG_SHOTCLOCK;
    shotClockClear();
};

const updateShotClock = () => {
    if (shotClockTime > 0) {
        shotClockTime -= constants.INTERVAL_MS;
    } else {
        if (!constTimerService.matchTimer) {
            shotClockClear();
        }
    }
};

const getShotClock = (req, res) => {
    res.json({ shotClockTime: shotClockTime });
};

const startShotClock = (req, res) => {
    if (!shotClockTimer) {
        shotClockTimer = setInterval(updateShotClock,constants.INTERVAL_MS);
    }
    res.json({ shotClockTime: shotClockTime });
};

const stopShotClock = (req, res) => {
    if (shotClockTimer) {
        shotClockClear();
    }
    res.json({ shotClockTime: shotClockTime });
};

const resetShotClock = (req, res) => {
    const { shotClock } = req.body;
    if (constTimerService.remainingTime <= shotClock) {
        shotClockClear();
        shotClockTime = "-1";
    } else {
        shotClockTime = shotClock;
        if (!shotClockTimer && constTimerService.matchTimer) {
            shotClockTimer = setInterval(updateShotClock, constants.INTERVAL_MS);
        }
    }
    res.json({ shotClockTime: shotClockTime });
};

// const resetShotClockShort = (req, res) => {
//     if (constTimerService.remainingTime <= constants.SHORT_SHOTCLOCK) {
//         clearInterval(shotClockTimer);
//         shotClockTimer = null;
//         shotClockTime = "-1";
//     } else {
//         shotClockTime = constants.SHORT_SHOTCLOCK;
//         if (!shotClockTimer && constTimerService.matchTimer) {
//             shotClockTimer = setInterval(updateShotClock, constants.INTERVAL_MS);
//         }
//     }
//     res.json({ shotClockTime: shotClockTime });
// };

module.exports = {
    resetShotClockDefault,
    getShotClock,
    startShotClock,
    stopShotClock,
    resetShotClock,
    // resetShotClockShort,
    shotClockTimer,
    shotClockTime,
    updateShotClock,
    shotClockClear,
};