const foulTypes = [
    { value: "charge", label: "Charge", classification: "offensive", penalty: "noShots", possession: "switch" },
    { value: "blocking", label: "Blocking", classification: "defensive", penalty: "teamDependent", possession: "sameTeam" },
    { value: "personal", label: "Personal", classification: "both", penalty: "teamDependent", possession: "switch" },
    { value: "shooting", label: "Shooting", classification: "both", penalty: "2Shots", possession: "switch" },
    { value: "technical", label: "Technical", classification: "both", penalty: "1Shot", possession: "sameTeam" },
    { value: "flagrant1", label: "Flagrant 1", classification: "both", penalty: "2Shots", possession: "sameTeam" },
    { value: "flagrant2", label: "Flagrant 2", classification: "both", penalty: "2Shots", possession: "sameTeam" },
    { value: "unsportsmanlike", label: "Unsportsmanlike", classification: "both", penalty: "2Shots", possession: "sameTeam" },
    { value: "disqualifying", label: "Disqualifying", classification: "both", penalty: "2Shots", possession: "sameTeam" },
    { value: "doubleFoul", label: "Double Foul", classification: "both", penalty: "noShots", possession: "sameTeam" },
    { value: "looseBall", label: "Loose Ball", classification: "both", penalty: "teamDependent", possession: "switch" },
    { value: "overTheBack", label: "Over The Back", classification: "both", penalty: "teamDependent", possession: "switch" },
    { value: "illegalScreen", label: "Illegal Screen", classification: "offensive", penalty: "noShots", possession: "switch" },
    { value: "push", label: "Push", classification: "both", penalty: "teamDependent", possession: "switch" },
    { value: "holding", label: "Holding", classification: "both", penalty: "teamDependent", possession: "switch" },
    { value: "handCheck", label: "HandCheck", classification: "both", penalty: "teamDependent", possession: "switch" },
    { value: "reaching", label: "Reaching", classification: "both", penalty: "teamDependent", possession: "switch" },
    { value: "teambench", label: "Team bench", classification: "both", penalty: "teamDependent", possession: "switch" },
    { value: "delayOfGame", label: "Delay of Game", classification: "both", penalty: "1Shot", possession: "switch" },
];

module.exports = foulTypes