const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const Chats = sequelize.define('chats',{
    id:{
        type:Sequelize.INTEGER,
        allownull:false,
        autoIncrement:true,
        primaryKey:true
    },
    message: {
        type: Sequelize.TEXT(),
        allowNull: false
    }
});

module.exports = Chats;