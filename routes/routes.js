const { Router } = require('express');

// Local Modules
const board = require('../controllers/board');
// const {ScoreService,TimerService,TimeOutService,PosessionService,FoulService,ShotClockService,PeriodService} = require('../controllers/board');

// Initialization
const router = Router();

// Requests 

// router.get('/score', ScoreService.getScore);

// router.post('/score', ScoreService.postScore);

// router.post('/start-timer', TimerService.startTimer);

// router.post('/stop-timer', TimerService.stopTimer);

// router.get('/time', TimerService.getTime);

// router.post('/start-shot-clock', ShotClockService.startShotClock);

// router.post('/stop-shot-clock', ShotClockService.stopShotClock);

// router.get('/shot-clock', ShotClockService.getShotClock);

// router.post('/reset-shot-clock', ShotClockService.resetShotClock);

// // router.post('/reset-shot-clock-short', board.resetShotClockShort);

// router.get('/period', PeriodService.getPeriod);

// router.post('/period', PeriodService.postPeriod);

// router.get('/posession', PosessionService.getPosession);

// router.post('/posession', PosessionService.postPosession);

// router.get('/fouls', FoulService.getFoul);

// router.post('/fouls', FoulService.postFoul);

// router.get('/time-outs', TimeOutService.getTimeOut);

// router.post('/time-outs', TimeOutService.postTimeOut);

// router.post('/reset', board.reset);

router.get('/score', board.getScore);

router.post('/score', board.postScore);

router.post('/start-timer', board.startTimer);

router.post('/stop-timer', board.stopTimer);

router.get('/time', board.getTime);

router.post('/start-shot-clock', board.startShotClock);

router.post('/stop-shot-clock', board.stopShotClock);

router.get('/shot-clock', board.getShotClock);

router.post('/reset-shot-clock', board.resetShotClock);

// router.post('/reset-shot-clock-short', board.resetShotClockShort);

router.get('/period', board.getPeriod);

router.post('/period', board.postPeriod);

router.get('/posession', board.getPosession);

router.post('/posession', board.postPosession);

router.get('/fouls', board.getFoul);

router.post('/fouls', board.postFoul);

router.get('/time-outs', board.getTimeOut);

router.post('/time-outs', board.postTimeOut);

router.post('/reset', board.reset);

// router.post('/reset-score', board.resetScore);

// router.post('/reset-shot-clock-default', board.resetShotClockDefault);

// router.post('/reset-timer', board.resetTimer);

// router.post('/reset-period', board.resetPeriod);

// router.post('/reset-posession', board.resetPosession);

// router.post('/reset-foul', board.resetFoul);

// router.post('/reset-time-outs', board.resetTimeOut);

module.exports = router;