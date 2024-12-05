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

module.exports = router;