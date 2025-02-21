const express = require('express');
const path = require('path');
const app = express();
const routes = require('./routes/routes.js');
const port = 3000;


app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));
app.use('/', routes); 

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Basketball scoreboard app listening at http://localhost:${port}`);
});


// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const Game = require('./models/gameModel'); // Asegúrate de que la ruta es correcta

// const app = express();
// const port = process.env.PORT || 3000;

// mongoose.connect('mongodb://localhost:27017/basketballScoreboard', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', () => {
//     console.log('Connected to the database');
// });

// app.use(bodyParser.json());

// app.post('/api/shots', async (req, res) => {
//     try {
//         const shot = req.body;
//         // Aquí puedes almacenar los datos del tiro en la base de datos
//         // Por ejemplo, podrías actualizar el modelo del juego actual

//         const game = await Game.findOne({});
//         if (game) {
//             game.shots.push(shot);
//             await game.save();
//         } else {
//             const newGame = new Game({
//                 shots: [shot]
//             });
//             await newGame.save();
//         }

//         res.status(200).json({ message: 'Tiro registrado exitosamente' });
//     } catch (error) {
//         console.error('Error al registrar el tiro:', error);
//         res.status(500).json({ message: 'Error interno del servidor' });
//     }
// });

// app.listen(port, () => {
//     console.log(`Servidor escuchando en el puerto ${port}`);