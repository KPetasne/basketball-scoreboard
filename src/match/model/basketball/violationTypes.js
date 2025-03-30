const violationTypes = [
    { value: "jumpball", label: "Jump Ball", category: "team", validatePossession: true, classification: "both", selection: 'none', autoChangePossession: false },
    { value: "halfCourtViolation", label: "Half Court Violation", category: "team", validatePossession: false, classification: "offensive", selection: 'one', autoChangePossession: true },
    { value: "backCourtViolation", label: "Back Court Violation", category: "team", validatePossession: false, classification: "offensive", selection: 'one', autoChangePossession: true },
    { value: "offensiveOutOfBounds", label: "Out of Bounds", category: "personal", validatePossession: false, classification: "offensive", selection: 'one', autoChangePossession: true },
    { value: "defensiveOutOfBounds", label: "Out of Bounds", category: "team", validatePossession: false, classification: "defensive", selection: 'one', autoChangePossession: false },
    { value: "foul", label: "Foul", category: "personal", validatePossession: true, classification: "both", selection: 'both', autoChangePossession: true },
    { value: "laneViolation", label: "Lane Violation", category: "team", validatePossession: false, classification: "offensive", selection: 'one', autoChangePossession: false },
    { value: "doubleDribble", label: "Double Dribble", category: "personal", validatePossession: false, classification: "offensive", selection: 'one', autoChangePossession: true },
    { value: "travel", label: "Travel", category: "personal", validatePossession: false, classification: "offensive", selection: 'one', autoChangePossession: true },
    { value: "threeSeconds", label: "Three Seconds", category: "team", validatePossession: false, classification: "offensive", selection: 'one', autoChangePossession: true },
    { value: "fiveSeconds", label: "Five Seconds", category: "team", validatePossession: false, classification: "offensive", selection: 'one', autoChangePossession: true },
    { value: "shotClockViolation", label: "Shot Clock Violation", category: "team", validatePossession: false, classification: "offensive", selection: 'one', autoChangePossession: true },
    { value: "offensiveGoaltending", label: "Offensive Goaltending", category: "team", validatePossession: false, classification: "offensive", selection: 'one', autoChangePossession: true },
    { value: "defensiveGoaltending", label: "Defensive Goaltending", category: "team", validatePossession: false, classification: "defensive", selection: 'one', autoChangePossession: true },
    { value: "kickedBall", label: "Kicked Ball", category: "personal", validatePossession: true, classification: "none", selection: 'both', autoChangePossession: true },
    { value: "delayOfGame", label: "Delay of Game", category: "team", validatePossession: false, classification: "none", selection: 'both', autoChangePossession: true },
    { value: "illegalDefense", label: "Illegal Defense", category: "team", validatePossession: false, classification: "defensive", selection: 'one', autoChangePossession: false },
];

module.exports = violationTypes