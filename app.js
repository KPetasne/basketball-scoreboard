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


  
