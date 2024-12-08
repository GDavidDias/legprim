//const http = require('http');
//const { Server } = require('socket.io');

const express = require('express');
const cors = require('cors');

const docentesRoutes = require('./src/routes/docentes.routes.js');
const legajosRoutes = require('./src/routes/legajos.routes.js');

const app = express();




//Configuracion de Middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//HABILITO CORS
app.use(cors());



//rutas
app.use('/api', docentesRoutes);
app.use('/api', legajosRoutes);


//server.listen(3001,()=>{console.log("Server Socket is Running")})

module.exports = app;
//module.exports = server;