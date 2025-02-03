import { LONG_SHOTCLOCK } from './constants.js';

const reset = (req, res) => {
    // Reiniciar estados a sus valores por defecto
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
    remainingTime = TEN_MINUTES; // 10 minutos
    shotClockTime = LONG_SHOTCLOCK;

    // Detener temporizadores si están activos
    if (matchTimer) {
        clearInterval(matchTimer);
        matchTimer = null;
    }
    if (shotClockTimer) {
        clearInterval(shotClockTimer);
        shotClockTimer = null;
    }

    res.json({
        home: homeScore,
        away: awayScore,
        time: remainingTime,
        shotClockTime: shotClockTime,
        period: period,
        posession: posession,
        homeFouls: homeFouls,
        awayFouls: awayFouls,
        homeTimeOuts: homeTimeOuts,
        awayTimeOuts: awayTimeOuts
    });
};

export  {
    reset
};
