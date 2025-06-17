const redis = require('redis');

const client = redis.createClient(); // usa config si es remoto

client.on('error', (err) => {
  console.error('Redis error:', err);
});

client.connect();

module.exports = client;
