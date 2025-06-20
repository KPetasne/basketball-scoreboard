const constants = require('../model/constants.js');

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
    const { isMatchTimerActive } = require('./timerService.js');
    if (shotClockTime > 0) {
        shotClockTime -= constants.INTERVAL_MS;
    } else {
        if (!isMatchTimerActive()) {
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
    const shotclock = req.body.shotclock;
    const { remainingTimeActive, isMatchTimerActive } = require('./timerService.js');

    if (remainingTimeActive <= shotclock) {
        shotClockClear();
        shotClockTime = -1; // Ensure it's a number instead of a string
    } else {
        shotClockTime = shotclock;
    }

    // Only start shot clock timer if the match timer is active
    if (!shotClockTimer && isMatchTimerActive()) {
        shotClockTimer = setInterval(updateShotClock, constants.INTERVAL_MS);
    }

    res.json({ shotClockTime });
};

const remainingShotClockTimeActive = () => {
    return shotClockTime;
};

module.exports = {
    resetShotClockDefault,
    getShotClock,
    startShotClock,
    stopShotClock,
    resetShotClock,
    shotClockTimer,
    shotClockTime,
    updateShotClock,
    shotClockClear,
    remainingShotClockTimeActive
};