let homeTimeOuts = 2;
let awayTimeOuts = 2;

const getTimeOut = (req, res) => {
    res.json({ homeTimeOuts, awayTimeOuts });
}

const postTimeOut = (req, res) => {
    const { team, timeOuts } = req.body;
    if (team === 'home' && homeTimeOuts > 0) {
        homeTimeOuts--;
    } else if (team === 'away' && awayTimeOuts > 0) {
        awayTimeOuts--;
    }
    res.json({ homeTimeOuts, awayTimeOuts });
}

export  {
    getTimeOut,
    postTimeOut,
};
