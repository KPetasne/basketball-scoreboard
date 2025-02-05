import { homeScore, awayScore } from './scoreService.js';
import {homeFouls, awayFouls } from './foulService.js';
import {homeTimeOuts, awayTimeOuts} from './timeOutService.js';
import {posession} from './posessionService.js';
import { shotClockTime, shotClockTimer} from './shotClockService.js';
import { INTERVAL_MS, LONG_SHOTCLOCK, SHORT_SHOTCLOCK } from './constants.js';
import { matchTimer,remainingTime } from './timerService.js';

let period = 1;

// const resetPeriod = () => {
//     period = 1;
//     res.json({ period: period });
// };

const getPeriod = (req, res) => {
    res.json({ period: period });
};

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
};

export {
    getPeriod,
    postPeriod,
    // resetPeriod
};
