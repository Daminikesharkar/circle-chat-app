const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const path = require('path');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./util/database');
const Users = require('./models/user');
const Chats = require('./models/chats');
const Groups = require('./models/group');
const Members = require('./models/member');

const mainroutes = require('./routes/main');
const userChatsroutes = require('./routes/userChats');

const cron = require('./services/cronjob');
cron.job.start();

const app = express();

app.use(cors({
    origin: '*',
    methods:['GET','POST'],  
}));

app.use(express.urlencoded({extended: false }));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());

app.use(mainroutes);
app.use(userChatsroutes);

Users.hasMany(Chats)
Chats.belongsTo(Users, { constraints: true });

Users.belongsToMany(Groups, { through: Members });
Groups.belongsToMany(Users, { through: Members });

Groups.hasMany(Chats);
Chats.belongsTo(Groups);

const server = http.createServer(app); 
const io = new Server(server);

io.on('connection', (socket) => {
    
    socket.on('new-group-message', (groupId)=> {
        socket.broadcast.emit('group-message',groupId);
    });
});

// sequelize.sync({ alter: true });
sequelize.sync();

server.listen(process.env.Port, () => {
    console.log(`Server is live on port ${process.env.Port}`);
});