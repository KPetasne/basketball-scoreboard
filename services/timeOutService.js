let homeTimeOuts = 2;
let awayTimeOuts = 2;

// const resetTimeOut = () => {
//     homeTimeOuts = 2;
//     awayTimeOuts = 2;
//     res.json({ homeTimeOuts: homeTimeOuts, awayTimeOuts: awayTimeOuts});
// };

const getTimeOut = (req, res) => {
    res.json({ homeTimeOuts: homeTimeOuts, awayTimeOuts: awayTimeOuts});
};

const postTimeOut = (req, res) => {
    const { team } = req.body;
    if (team === 'home' && homeTimeOuts > 0) {
        homeTimeOuts--;
    } else if (team === 'away' && awayTimeOuts > 0) {
        awayTimeOuts--;
    }
    res.json({ homeTimeOuts: homeTimeOuts, awayTimeOuts: awayTimeOuts});
};

export  {
    getTimeOut,
    postTimeOut,
    // resetTimeOut,
    homeTimeOuts,
    awayTimeOuts
};
