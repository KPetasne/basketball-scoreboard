const TEN_MINUTES = 600000;
const ONE_MINUTE = 60000;
const LONG_SHOTCLOCK = 24000;
const SHORT_SHOTCLOCK = 14000;
const FIVE_SECOND = 5000;
const ONE_SECOND = 1000;
const INTERVAL_MS = 100;
const GAME_START = {
    gameID: "gameId",
    home: { score: 0, fouls: 0, timeouts: 0 },
    away: { score: 0, fouls: 0, timeouts: 0 },
    actions: []
  };

const GAME_SETTINGS = {
  TEAMS: {
    HOME: "HOME",
    AWAY: "AWAY"
  },
  LEADER: {
    TIE: "TIE",
    CHANGE_EVENT: "CHANGE_LEADER_EVENT"
  }
}

module.exports = {
    TEN_MINUTES,
    ONE_MINUTE,
    LONG_SHOTCLOCK,
    SHORT_SHOTCLOCK,
    FIVE_SECOND,
    ONE_SECOND,
    INTERVAL_MS,
    GAME_START,
    GAME_SETTINGS
};