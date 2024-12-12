//const http = require('http');
//const { Server } = require('socket.io');

const express = require('express');
const cors = require('cors');

const docentesRoutes = require('./src/routes/docentes.routes.js');
const legajosRoutes = require('./src/routes/legajos.routes.js');
const formacionRoutes = require('./src/routes/formacion.routes.js');
const userRoutes = require('./src/routes/user.routes.js');
const tablasAuxiliaresRoutes = require('./src/routes/tablasAuxiliares.routes.js');

const app = express();


//Configuracion de Middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//HABILITO CORS
app.use(cors());

//rutas
app.use('/api', docentesRoutes);
app.use('/api', legajosRoutes);
app.use('/api', formacionRoutes);
app.use('/api', userRoutes);
app.use('/api', tablasAuxiliaresRoutes);


//server.listen(3001,()=>{console.log("Server Socket is Running")})

module.exports = app;
//module.exports = server;