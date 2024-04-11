const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./util/database');

const mainroutes = require('./routes/main');
const userChatsroutes = require('./routes/userChats');

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

// sequelize.sync({ alter: true });
sequelize.sync();

app.listen(process.env.Port || 3000,()=>{
    console.log(`server is live on port ${process.env.Port}`);
})