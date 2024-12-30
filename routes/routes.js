const { Router } = require('express');

// Local Modules
const board = require('../controllers/board');

// Initialization
const router = Router();

// Requests 
router.get('/score', board.getScore);

router.post('/score', board.postScore);

router.post('/reset', board.reset);

router.post('/start-timer', board.startTimer);

router.post('/stop-timer', board.stopTimer);

router.get('/time', board.getTime);

router.post('/start-shot-clock', board.startShotClock);

router.post('/stop-shot-clock', board.stopShotClock);

router.get('/shot-clock', board.getShotClock);

router.post('/reset-shot-clock', board.resetShotClock);

router.post('/reset-shot-clock-short', board.resetShotClockShort);

router.get('/period', board.getPeriod);

router.post('/period', board.postPeriod);

router.get('/posession', board.getPosession);

router.post('/posession', board.postPosession);

router.get('/fouls', board.getFoul);

router.post('/fouls', board.postFoul);

router.get('/time-outs', board.getTimeOut);

router.post('/time-outs', board.postTimeOut);

module.exports = router;