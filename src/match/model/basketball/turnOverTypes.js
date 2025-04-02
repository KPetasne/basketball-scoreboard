
const turnOverTypes = [
    { value: "handle", label: "Handle Turnover", type: "steal", stopsGame: false, category: "personal" }, 
    { value: "team", label: "Team Turnover", type: "violation", stopsGame: true, category: "team" }, 
    { value: "badPass", label: "Bad Pass", type: "steal", stopsGame: false, category: "personal" }, 
    { value: "travel", label: "Travel", type: "violation", stopsGame: true, category: "personal" }, 
    { value: "doubleDribble", label: "Double Dribble", type: "violation", stopsGame: true, category: "personal" }, 
    { value: "threeSeconds", label: "Three Seconds", type: "violation", stopsGame: true, category: "personal" }, 
    { value: "fiveSeconds", label: "Five Seconds", type: "violation", stopsGame: true, category: "team" }, 
    { value: "shotClockViolation", label: "Shot Clock Violation", type: "violation", stopsGame: true, category: "team" }, 
    { value: "offensiveFoul", label: "Offensive Foul", type: "violation", stopsGame: true, category: "personal" }, 
    { value: "illegalScreen", label: "Illegal Screen", type: "violation", stopsGame: true, category: "personal" }, 
    { value: "laneViolation", label: "Lane Violation", type: "violation", stopsGame: true, category: "team" }, 
    { value: "offensiveOutOfBounds", label: "Out of Bounds", type: "violation", stopsGame: true, category: "personal" }, 
    { value: "halfCourtViolation", label: "Half Court", type: "violation", stopsGame: true, category: "team" }, 
    { value: "backCourtViolation", label: "Back Court", type: "violation", stopsGame: true, category: "team" }, 
    { value: "offensiveGoaltending", label: "Offensive Goaltending", type: "violation", stopsGame: true, category: "team" }, 
    { value: "offensiveOutOfBounds", label: "Step Out of Bounds", type: "violation", stopsGame: true, category: "personal" }, 
    { value: "heldBall", label: "Held Ball", type: "violation", stopsGame: true, category: "team" }, 
    { value: "kickedBall", label: "Kicked Ball", type: "violation", stopsGame: true, category: "team" }, 
    { value: "delayOfGame", label: "Delay of Game", type: "violation", stopsGame: true, category: "team" }, 
    { value: "turnoverViolation", label: "Turnover Violation", type: "violation", stopsGame: true, category: "team" }, 
    { value: "jumpBall", label: "Jump Ball", type: "violation", stopsGame: true, category: "team" }, 
];

module.exports = turnOverTypes    