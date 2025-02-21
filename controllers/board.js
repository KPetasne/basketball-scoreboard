const ScoreService = require('../services/scoreService.js');
const TimerService = require('../services/timerService.js');
const ShotClockService = require('../services/shotClockService.js');
const FoulService = require('../services/foulService.js');
const TimeOutService = require('../services/timeOutService.js');
const PeriodService = require('../services/periodService.js');
const PosessionService = require('../services/posessionService.js');


const constants = require('../services/constants.js');

// const Game = require('./models/gameModel'); // Asegúrate de que la ruta es correcta

// const saveGameState = async () => {
//     const game = await Game.findOne({});
//     if (game) {
//         game.homeScore = homeScore;
//         game.awayScore = awayScore;
//         game.homeFouls = homeFouls;
//         game.awayFouls = awayFouls;
//         game.homeTimeOuts = homeTimeOuts;
//         game.awayTimeOuts = awayTimeOuts;
//         game.homePosession = homePosession;
//         game.awayPosession = awayPosession;
//         game.period = period;
//         game.posession = posession;
//         game.remainingTime = remainingTime;
//         game.shotClockTime = shotClockTime;
//         game.shotClockTimer = shotClockTimer !== null;
//     } else {
//         const newGame = new Game({
//             homeScore,
//             awayScore,
//             homeFouls,
//             awayFouls,
//             homeTimeOuts,
//             awayTimeOuts,
//             homePosession,
//             awayPosession,
//             period,
//             posession,
//             remainingTime,
//             shotClockTime,
//             shotClockTimer: shotClockTimer !== null
//         });
//         await newGame.save();
//     }
// };

// const loadGameState = async () => {
//     const game = await Game.findOne({});
//     if (game) {
//         homeScore = game.homeScore;
//         awayScore = game.awayScore;
//         homeFouls = game.homeFouls;
//         awayFouls = game.awayFouls;
//         homeTimeOuts = game.homeTimeOuts;
//         awayTimeOuts = game.awayTimeOuts;
//         homePosession = game.homePosession;
//         awayPosession = game.awayPosession;
//         period = game.period;
//         posession = game.posession;
//         remainingTime = game.remainingTime;
//         shotClockTime = game.shotClockTime;
//         if (game.shotClockTimer) {
//             shotClockTimer = setInterval(updateShotClock, constants.INTERVAL_MS);
//         }
//     }
// };

// // Llama a loadGameState al iniciar el servidor para cargar el estado del juego
// loadGameState().then(() => {
//     console.log('Estado del juego cargado');
// });


const reset = (req, res) => {
    ScoreService.resetScore();
    FoulService.resetFoul();
    TimeOutService.resetTimeOut(2);
    PosessionService.resetPosession();
    PeriodService.resetPeriod();
    TimerService.resetTimer();
    ShotClockService.resetShotClockDefault(constants.LONG_SHOTCLOCK);
    res.json({ home: ScoreService.homeScore, away: ScoreService.awayScore, time: TimerService.remainingTimeActive, shotClockTime: ShotClockService.shotClockTime, period: PeriodService.period, posession: PosessionService.posession, homeFouls: FoulService.homeFouls, awayFouls: FoulService.awayFouls, homeTimeOuts: TimeOutService.homeTimeOuts, awayTimeOuts: TimeOutService.awayTimeOuts });
}

module.exports = {
    getScore: ScoreService.getScore,
    postScore: ScoreService.postScore,
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
    reset
}