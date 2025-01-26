let matchTimer = null;
let remainingTime = 600000; // 600 = 10 minutes in seconds
let shotClockTime = 24000;
let shotClockTimer = null;

const updateTime = () => {
    if (remainingTime > 0) {
        remainingTime -= 100;
    } else {
        clearInterval(matchTimer);
        matchTimer = null;
    }
};

const updateShotClock = () => {
    if (shotClockTime > 0) {
        shotClockTime -= 100;
    } else {
        clearInterval(shotClockTimer);
        shotClockTimer = null;
    }
};

const resetTime = () => {
    remainingTime = 600000; // resetear a lo que se indique por default 60000 = 10 minutos
    if (matchTimer) {
        clearInterval(matchTimer);
        matchTimer = null;
    }
    shotClockTime = 24000;
    if (shotClockTimer) {
        clearInterval(shotClockTimer);
        shotClockTimer = null;
    }
}

const startTimerLocal = () => {
    if (!matchTimer) {
        matchTimer = setInterval(updateTime, 100);
    }
    if (!shotClockTimer) {
        shotClockTimer = setInterval(updateShotClock, 100);
    }
}

const stopTimerLocal = () => {
    if (matchTimer) {
        clearInterval(matchTimer);
        matchTimer = null;
    }
    if (shotClockTimer) {
        clearInterval(shotClockTimer);
        shotClockTimer = null;
    }
}

const startShotClockLocal = () => {
    if (!shotClockTimer) {
        shotClockTimer = setInterval(updateShotClock, 100);
    }
}

const stopShotClockLocal = () => {
    if (shotClockTimer) {
        clearInterval(shotClockTimer);
        shotClockTimer = null;
    }
}

const resetShotClockLocal = () => {
    shotClockTime = 24000;
}

const resetShotClockShortLocal = () => {
    shotClockTime = 14000;
}

export default {
    matchTimer,
    remainingTime,
    shotClockTime,
    shotClockTimer,
    resetTime,
    startTimerLocal,
    stopTimerLocal,
    startShotClockLocal,
    stopShotClockLocal,
    resetShotClockLocal,
    resetShotClockShortLocal
}