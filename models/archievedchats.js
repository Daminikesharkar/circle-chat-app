const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const Archievedchats = sequelize.define('archievedchats',{
    id:{
        type:Sequelize.INTEGER,
        allownull:false,
        autoIncrement:true,
        primaryKey:true
    },
    message: {
        type: Sequelize.TEXT(),
        allowNull: false
    },
    userId:{
        type: Sequelize.BIGINT,
    },
    groupId:{
        type: Sequelize.BIGINT,
    }
});

module.exports = Archievedchats;