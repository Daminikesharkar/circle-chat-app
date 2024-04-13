const sequelize = require('../util/database')
const Sequelize = require('sequelize')

const Members = sequelize.define('members',{
    id:{
        type : Sequelize.INTEGER,
        autoIncrement : true,
        primaryKey : true,
        allowNull : false
    },
    admin:{
        type : Sequelize.BOOLEAN,
        defaultValue : false
    }
})

module.exports = Members;