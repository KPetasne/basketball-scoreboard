let homePosession = false;
let awayPosession = false;
let posession = null;

// const resetPosession = () => {
//     let homePosession = false;
//     let awayPosession = false;
//     let posession = null;
//     res.json({ homePosession: homePosession, awayPosession: awayPosession, posession: posession });
// };

const getPosession = (req, res) => {
    res.json({ homePosession: homePosession, awayPosession: awayPosession, posession: posession });
};

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
    res.json({ homePosession: homePosession, awayPosession: awayPosession, posession: posession });
};

export {
    getPosession,
    postPosession,
    // resetPosession,
    posession
};
