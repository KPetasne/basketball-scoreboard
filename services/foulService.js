let homeFouls = 0;
let awayFouls = 0;

const resetFoul = () => {
    homeFouls = 0;
    awayFouls = 0;
    // res.json({ homeFouls, awayFouls });
};

const getFoul = (req, res) => {
    res.json({ homeFouls, awayFouls });
};

const postFoul = (req, res) => {
    const { team, fouls } = req.body;
    if (team === 'home') {
        if (fouls === 1 && homeFouls < 5) {
            homeFouls++;
        } else if (fouls === -1 && homeFouls > 0) {
            homeFouls--;
        }
    } else if (team === 'away') {
        if (fouls === 1 && awayFouls < 5) {
            awayFouls++;
        } else if (fouls === -1 && awayFouls > 0) {
            awayFouls--;
        }
    }
    res.json({ homeFouls, awayFouls });
};

module.exports = {
    resetFoul,
    getFoul,
    postFoul,
    homeFouls,
    awayFouls,
};
