// import { getScore, postScore } from '../services/scoreService.js';
// import { updateTime, startTimer, stopTimer, getTime } from '../services/timerService.js';
// import { updateShotClock, getShotClock, startShotClock, stopShotClock, resetShotClock, resetShotClockShort } from '../services/shotClockService.js';
// import { getFoul, postFoul } from '../services/foulService.js';
// import { getTimeOut, postTimeOut } from '../services/timeOutService.js';
// import { getPeriod, postPeriod } from '../services/periodService.js';
// import { getPosession, postPosession } from '../services/posessionService.js';
import {TEN_MINUTES,ONE_MINUTE,LONG_SHOTCLOCK,SHORT_SHOTCLOCK,FIVE_SECOND,ONE_SECOND,INTERVAL_MS } from '../services/constants.js';

let homeScore = 0;
let awayScore = 0;
let homeFouls = 0;
let awayFouls = 0;
let homeTimeOuts = 2; 
let awayTimeOuts = 2;
let homePosession = false; 
let awayPosession = false;
let period = 1;
let posession = null;
let matchTimer = null;
let remainingTime = TEN_MINUTES; // 600 = 10 minutes in seconds
let shotClockTime = LONG_SHOTCLOCK;
let shotClockTimer = null;

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

const getScore = (req, res) => {
    res.json({ home: homeScore, away: awayScore });
}

const postScore = (req, res) => {
    const { team, points } = req.body;
    if (team === 'home') {
        if (points === -1){
            if (homeScore > 0){
                homeScore += points;
            }
        }else{
            homeScore += points;
        }
    } else if (team === 'away') {
        if (points === -1){
            if (awayScore > 0){
                awayScore += points;
            }
        }else{
            awayScore += points;
        }
    }
    res.json({ home: homeScore, away: awayScore });
}

const reset = (req, res) => {
    homeScore = 0;
    awayScore = 0;
    homeFouls = 0;
    awayFouls = 0;
    homeTimeOuts = 2;
    awayTimeOuts = 2;
    homePosession = false;
    awayPosession = false;
    period = 1;
    posession = null;
    remainingTime = TEN_MINUTES; // resetear a lo que se indique por default 60000 = 10 minutos
    if (matchTimer) {
        clearInterval(matchTimer);
        matchTimer = null;
    }
    shotClockTime = LONG_SHOTCLOCK;
    if (shotClockTimer) {
        clearInterval(shotClockTimer);
        shotClockTimer = null;
    }
    res.json({ home: homeScore, away: awayScore, time: remainingTime, shotClockTime: shotClockTime, period: period, posession: posession, homeFouls: homeFouls, awayFouls: awayFouls, homeTimeOuts: homeTimeOuts, awayTimeOuts: awayTimeOuts });
}

const startTimer = (req, res) => {
    if (!matchTimer) {
        matchTimer = setInterval(updateTime, INTERVAL_MS);
    }
    if (!shotClockTimer) {
        shotClockTimer = setInterval(updateShotClock, INTERVAL_MS);
    }
    res.json({ time: remainingTime, shotClockTime: shotClockTime });
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

const getShotClock = (req, res) => {
    res.json({ shotClockTime: shotClockTime });
}
const startShotClock = (req, res) => {
    if (!shotClockTimer) {
        shotClockTimer = setInterval(updateShotClock, INTERVAL_MS);
    }
    res.json({ shotClockTime: shotClockTime });
}

const stopShotClock = (req, res) => {
    if (shotClockTimer) {
        clearInterval(shotClockTimer);
        shotClockTimer = null;
    }
    res.json({ shotClockTime: shotClockTime });
}
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
}
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
}

const getFoul = (req, res) => {
    res.json({ homeFouls: homeFouls, awayFouls: awayFouls });
}

const postFoul = (req, res) => {
    const { team, fouls } = req.body;
    if (team === 'home') {
        if (fouls === 1){
            if (homeFouls < 5){
                homeFouls ++;
            }
        }else{
            if (homeFouls > 0){
                homeFouls --;
            }
        }
    } else if (team === 'away') {
        if (fouls === 1){
            if (awayFouls < 5){
                awayFouls ++;
            }
        }else{
            if (awayFouls > 0){
                awayFouls --;
            }
        }
    }
    res.json({ homeFouls: homeFouls, awayFouls: awayFouls });
}

const getTimeOut = (req, res) => {
    res.json({ homeTimeOuts: homeTimeOuts, awayTimeOuts: awayTimeOuts});
}

const postTimeOut = (req, res) => {
    const { team, timeOuts } = req.body;
    if (team === 'home') {
        if (homeTimeOuts > 0){
            homeTimeOuts --;
        }
    } else if (team === 'away') {
        if (awayTimeOuts > 0){
            awayTimeOuts --;
        }
    }
    res.json({ homeTimeOuts: homeTimeOuts, awayTimeOuts: awayTimeOuts });
}

const getPeriod = (req, res) => {
    res.json({ period: period });
}
const postPeriod = (req, res) => {
    if (period < 4){
        period++;
        if (period ===3){
            homeTimeOuts = 3;
            awayTimeOuts = 3;
        }
        homeFouls = 0;
        awayFouls = 0;
        remainingTime = TEN_MINUTES; // resetear a lo que se indique por default 60000 = 10 minutos
        if (matchTimer) {
            clearInterval(matchTimer);
            matchTimer = null;
        }
        shotClockTime = LONG_SHOTCLOCK;
        if (shotClockTimer) {
            clearInterval(shotClockTimer);
            shotClockTimer = null;
        }          
    }
    res.json({ home: homeScore, away: awayScore, time: remainingTime, shotClockTime: shotClockTime, period: period, posession: posession, homeFouls: homeFouls, awayFouls: awayFouls, homeTimeOuts: homeTimeOuts, awayTimeOuts: awayTimeOuts });
}

const getPosession = (req, res) => {
    res.json({ homePosession: homePosession, awayPosession: awayPosession, posession: posession });
}

const postPosession = (req, res) => {
    const { team, homeTeam } = req.body;
    if (team === 'home') {
        if (homePosession === false){
            homePosession = true;
            awayPosession = false;
            posession = "home";
        }
    } else if (team === 'away') {
        if (awayPosession === false){
            awayPosession = true;
            homePosession = false;
            posession = "away";
        }
    }
    res.json({ homePosession: homePosession, awayPosession: awayPosession, posession: posession });
}

export {
    getScore,
    postScore,
    startTimer,
    stopTimer,
    getTime,
    getShotClock,
    startShotClock,
    stopShotClock,
    resetShotClock,
    resetShotClockShort,
    getFoul,
    postFoul,
    getTimeOut,
    postTimeOut,
    getPeriod,
    postPeriod,
    getPosession,
    postPosession,
    reset
    // resetScore,
    // resetPeriod,
    // resetTimeOut,
    // resetFoul,
    // resetShotClockDefault,
    // resetTimer,
    // resetPosession
}