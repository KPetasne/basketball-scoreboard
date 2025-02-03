let period = 1;

const getPeriod = (req, res) => {
    res.json({ period });
}

const postPeriod = (req, res) => {
    if (period < 4) {
        period++;
    }
    res.json({ period });
}

export {
    getPeriod,
    postPeriod,
};
