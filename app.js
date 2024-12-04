const express = require('express');
const app = express();
const port = 3000;

let prueba = "hola";
let homeScore = 0;
let awayScore = 0;
let matchTimer = null;
let remainingTime = 600; // 10 minutes in seconds

app.use(express.json());
app.use(express.static('public'));

const updateTime = () => {
    if (remainingTime > 0) {
        remainingTime--;
    } else {
        clearInterval(matchTimer);
        matchTimer = null;
    }
};

app.get('/score', (req, res) => {
    res.json({ home: homeScore, away: awayScore });
});

app.post('/score', (req, res) => {
    const { team, points } = req.body;
    if (team === 'home') {
        homeScore += points;
    } else if (team === 'away') {
        awayScore += points;
    }
    res.json({ home: homeScore, away: awayScore });
});

app.post('/reset', (req, res) => {
    homeScore = 0;
    awayScore = 0;
    remainingTime = 600;
    if (matchTimer) {
        clearInterval(matchTimer);
        matchTimer = null;
    }
    res.json({ home: homeScore, away: awayScore, time: remainingTime });
});

app.post('/start-timer', (req, res) => {
    if (!matchTimer) {
        matchTimer = setInterval(updateTime, 1000);
    }
    res.json({ time: remainingTime });
});

app.post('/stop-timer', (req, res) => {
    if (matchTimer) {
        clearInterval(matchTimer);
        matchTimer = null;
    }
    res.json({ time: remainingTime });
});

app.get('/time', (req, res) => {
    res.json({ time: remainingTime });
});

app.listen(port, () => {
    console.log(`Basketball scoreboard app listening at http://localhost:${port}`);
});
