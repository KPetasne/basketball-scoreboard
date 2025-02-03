let homePosession = false;
let awayPosession = false;
let posession = null;

const getPosession = (req, res) => {
    res.json({ homePosession, awayPosession });
}

const postPosession = (req, res) => {
    const { team } = req.body;
    if (team === 'home') {
        homePosession = true;
        awayPosession = false;
    } else if (team === 'away') {
        homePosession = false;
        awayPosession = true;
    }
    posession = team;
    res.json({ homePosession, awayPosession });
}

export {
    getPosession,
    postPosession,
};
