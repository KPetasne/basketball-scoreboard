const actionTypes = [
    {
        value: "violation",
        onaction: true,
        stoptime: true, 
        stats: ["teamPlay", "violationType", "turnOverType"],
        dependsOn: "start",
    },
    {
        value: "turnover",
        onaction: true,
        stoptime: false,
        stats: ["teamPlay", "changeOffence", "turnOverType"],
        dependsOn: "start",
    },
    {
        value: "shot",
        onaction: true,
        stoptime: false,
        stats: ["shotPlayer", "shotType", "points", "assistPlayer", "distanceFromHoop"],
        dependsOn: "start",
    },
    {
        value: "start",
        onaction: false,
        stoptime: false,
        stats: ["teamOffence", "actionType"],
        dependsOn: null,
    },
    {
        value: "endtime",
        onaction: true,
        stoptime: true,
        stats: ["actionType", "teamPlay", "gameClockTime"],
        dependsOn: "notime",
    },
    {
        value: "substitution",
        onaction: false,
        stoptime: false,
        stats: ["actionType", "playerOut", "playerIn"],
        dependsOn: "start",
    },
    {
        value: "timeout",
        onaction: false,
        stoptime: false,
        stats: ["actionType", "teamCallingTimeout", "timeoutDuration"],
        dependsOn: "start",
    },
    {
        value: "miscelaneous",
        onaction: false,
        stoptime: false,
        stats: ["description", "timeElapsed"],
        dependsOn: "start",
    },
];

module.exports = actionTypes