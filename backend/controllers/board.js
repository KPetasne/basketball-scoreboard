const TimerService = require('../services/timerService.js');
const ShotClockService = require('../services/shotClockService.js');
const FoulService = require('../services/foulService.js');
const TimeOutService = require('../services/timeOutService.js');
const PeriodService = require('../services/periodService.js');
const PosessionService = require('../services/posessionService.js');
const PlayService = require('../services/playServices.js');


const constants = require('../model/constants.js');

const reset = (req, res) => {
    FoulService.resetFoul();
    TimeOutService.resetTimeOut(2);
    PosessionService.resetPosession();
    PeriodService.resetPeriod();
    TimerService.resetTimer();
    ShotClockService.resetShotClockDefault(constants.LONG_SHOTCLOCK);
    PlayService.resetPlays();
    res.json({time: TimerService.remainingTimeActive, shotClockTime: ShotClockService.shotClockTime, period: PeriodService.period, posession: PosessionService.posession, homeFouls: FoulService.homeFouls, awayFouls: FoulService.awayFouls, homeTimeOuts: TimeOutService.homeTimeOuts, awayTimeOuts: TimeOutService.awayTimeOuts });
}

module.exports = {
    startTimer: TimerService.startTimer,
    stopTimer: TimerService.stopTimer,
    getTime: TimerService.getTime,
    getShotClock: ShotClockService.getShotClock,
    startShotClock: ShotClockService.startShotClock,
    stopShotClock: ShotClockService.stopShotClock,
    resetShotClock: ShotClockService.resetShotClock,
    getFoul: FoulService.getFoul,
    postFoul: FoulService.postFoul,
    getTimeOut: TimeOutService.getTimeOut,
    postTimeOut: TimeOutService.postTimeOut,
    getPeriod: PeriodService.getPeriod,
    postPeriod: PeriodService.postPeriod,
    getPosession: PosessionService.getPosession,
    postPosession: PosessionService.postPosession,
    getPlay: PlayService.getPlay,
    postPlay: PlayService.postPlay,
    reset
}