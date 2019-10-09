const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');
const path = require('path');
const socketio = require('socket.io');
const http = require('http');

const app = express();
const server = http.Server(app);
const io = socketio(server);

mongoose.connect('mongodb+srv://appusr:Uo52QluyXzVgbwqw@cluster0-vys5q.mongodb.net/test?retryWrites=true&w=majority',{
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

// armazenar os usuários conectados, lembrando que esta é uma solicação stateless,
// o correto é utilizar uma solução de autenticação e armazenar a sessão relacionada ao usuário em um serviço
const connectedUsers ={};
io.on('connection', socket => {
   const { user_id } = socket.handshake.query;
   connectedUsers[user_id] = socket.id; 
});

app.use((req, res, next) => {
   req.io = io;
   req.connectedUsers = connectedUsers;

   // seguir o fluxo normal da aplicação.
   return next();
})

// possíveis tipos de métodos de conversão: GET, POST, PUT, DELETE

// req.query = Acessar query params (para filtros)
// rep.params = Acessar route params (para edição, delete)
// req.body = Acessar corpo da requisição ( criação, edição)

// Configura o app para aceitar acessos a API Rest de qualquer endereço IP de clients;
app.use(cors());
// Configurar a requisoção no express para utilizar o formato json
app.use(express.json());
app.use('/files',express.static( path.resolve(__dirname,'../', 'uploads' )));
app.use(routes);



server.listen(3333);
