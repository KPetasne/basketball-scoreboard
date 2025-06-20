const violationTypes = [
    { value: "jumpball", label: "Jump Ball", category: "team", validatePossession: true, classification: "both", selection: 'none', autoChangePossession: false, postInformation: false },
    { value: "halfCourtViolation", label: "Half Court Violation", category: "team", validatePossession: false, classification: "offensive", selection: 'one', autoChangePossession: true, postInformation: false },
    { value: "backCourtViolation", label: "Back Court Violation", category: "team", validatePossession: false, classification: "offensive", selection: 'one', autoChangePossession: true, postInformation: false },
    { value: "offensiveOutOfBounds", label: "Out of Bounds", category: "personal", validatePossession: false, classification: "offensive", selection: 'one', autoChangePossession: true, postInformation: true },
    { value: "defensiveOutOfBounds", label: "Out of Bounds", category: "team", validatePossession: false, classification: "defensive", selection: 'one', autoChangePossession: false, postInformation: false },
    { value: "foul", label: "Foul", category: "personal", validatePossession: true, classification: "both", selection: 'both', autoChangePossession: true, postInformation: true },
    { value: "laneViolation", label: "Lane Violation", category: "team", validatePossession: false, classification: "offensive", selection: 'one', autoChangePossession: false, postInformation: true },
    { value: "doubleDribble", label: "Double Dribble", category: "personal", validatePossession: false, classification: "offensive", selection: 'one', autoChangePossession: true, postInformation: true },
    { value: "travel", label: "Travel", category: "personal", validatePossession: false, classification: "offensive", selection: 'one', autoChangePossession: true, postInformation: true },
    { value: "threeSeconds", label: "Three Seconds", category: "team", validatePossession: false, classification: "offensive", selection: 'one', autoChangePossession: true, postInformation: false },
    { value: "fiveSeconds", label: "Five Seconds", category: "team", validatePossession: false, classification: "offensive", selection: 'one', autoChangePossession: true, postInformation: true },
    { value: "shotClockViolation", label: "Shot Clock Violation", category: "team", validatePossession: false, classification: "offensive", selection: 'one', autoChangePossession: true, postInformation: false },
    { value: "offensiveGoaltending", label: "Offensive Goaltending", category: "team", validatePossession: false, classification: "offensive", selection: 'one', autoChangePossession: true, postInformation: false },
    { value: "defensiveGoaltending", label: "Defensive Goaltending", category: "team", validatePossession: false, classification: "defensive", selection: 'one', autoChangePossession: true, postInformation: true },
    { value: "kickedBall", label: "Kicked Ball", category: "personal", validatePossession: true, classification: "none", selection: 'both', autoChangePossession: true, postInformation: false },
    { value: "delayOfGame", label: "Delay of Game", category: "team", validatePossession: false, classification: "none", selection: 'both', autoChangePossession: true, postInformation: false },
    { value: "illegalDefense", label: "Illegal Defense", category: "team", validatePossession: false, classification: "defensive", selection: 'one', autoChangePossession: false, postInformation: false },
];

module.exports = violationTypes