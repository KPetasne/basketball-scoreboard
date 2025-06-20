require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http'); // 👈 Para crear el servidor base
const { Server } = require('socket.io');
const redis = require('./clients/db/redisClient.js'); // 👈 Tu cliente Redis
const routes = require('./routes/routes.js');
const constants = require('./model/constants.js')
const scoreService = require('./services/scoreService.js')

const app = express();
const port = 3000;

// Crear servidor HTTP con Express
const server = http.createServer(app);
const frontendBuildPath = path.join(__dirname, '..', 'build');

// Inicializar Socket.IO
const io = new Server(server, {
  cors: { origin: '*' }, // Ajustalo si usás dominio específico
});

// Middleware
app.use(express.json());
//app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(frontendBuildPath));
app.use('/', routes);

// Catch-all para React Router (SPA)
app.get('*', (req, res) => {
  res.sendFile(frontendBuildPath);
});

// Socket.IO – lógica de partido con Redis
io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado:', socket.id);
  /*
  ACTION
    El modelo que se persiste es:
    - gameID: string (es el identificador del partido actual)
    - home: TeamStats
    - away: TeamStats
    - actions: GameActions[]

    TeamStats esta compuesto por:
    - score: int
    - fouls: int
    - timeouts: int

    GameActions esta compuesto por:
    - id: string
    - type: string
    - team: string (las opciones son home o away)
    - time: string (momento en el que paso la accion)
    - data: {} (un objeto que varia segun el type)
    - events: [] (una lista de eventos a definir)
  */
  socket.on('game_action', async (action) => {
    const gameId = action.gameId;
    const key = `game:${gameId}`;

    try {
      // Obtener estado actual
      const current = await redis.get(key);
      const game = current ? JSON.parse(current) : constants.GAME_START;

      switch (action.type){
        case SCORE:
            newGame = scoreService.updateScore(game, action);
            break;
        case FOUL:
            break;
        case POSITION:
            break;
      }

      await redis.set(key, JSON.stringify(newGame));

      // Emitir a todos
      io.emit('game_update', newGame);
    } catch (err) {
      console.error('❌ Error actualizando estado del juego:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 Cliente desconectado:', socket.id);
  });
});

// Iniciar servidor HTTP (Express + Socket.IO)
server.listen(port, () => {
  console.log(`🏀 Basketball scoreboard app en http://localhost:${port}`);
});
