let homeScore = 0;
let awayScore = 0;

const getScore = (req, res) => {
    res.json({ home: homeScore, away: awayScore });
}

const postScore = (req, res) => {
    const { team, points } = req.body;
    if (team === 'home') {
        if (points === -1 && homeScore > 0) {
            homeScore += points;
        } else {
            homeScore += points;
        }
    } else if (team === 'away') {
        if (points === -1 && awayScore > 0) {
            awayScore += points;
        } else {
            awayScore += points;
        }
    }
    res.json({ home: homeScore, away: awayScore });
}

export  {
    getScore,
    postScore,
};