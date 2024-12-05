let homeScore = 0;
let awayScore = 0;
let matchTimer = null;
let remainingTime = 600; // 10 minutes in seconds

const updateTime = () => {
    if (remainingTime > 0) {
        remainingTime--;
    } else {
        clearInterval(matchTimer);
        matchTimer = null;
    }
};

const getScore = (req, res) => {
    res.json({ home: homeScore, away: awayScore });
}

const postScore = (req, res) => {
    const { team, points } = req.body;
    if (team === 'home') {
        homeScore += points;
    } else if (team === 'away') {
        awayScore += points;
    }
    res.json({ home: homeScore, away: awayScore });
}

const reset = (req, res) => {
    homeScore = 0;
    awayScore = 0;
    remainingTime = 600;
    if (matchTimer) {
        clearInterval(matchTimer);
        matchTimer = null;
    }
    res.json({ home: homeScore, away: awayScore, time: remainingTime });
}

const startTimer = (req, res) => {
    if (!matchTimer) {
        matchTimer = setInterval(updateTime, 1000);
    }
    res.json({ time: remainingTime });
}

const stopTimer = (req, res) => {
    if (matchTimer) {
        clearInterval(matchTimer);
        matchTimer = null;
    }
    res.json({ time: remainingTime });
}

const getTime = (req, res) => {
    res.json({ time: remainingTime });
}

module.exports = {
    getScore,
    postScore,
    reset,
    startTimer,
    stopTimer,
    getTime
}