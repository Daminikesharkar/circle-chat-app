const Chats = require('../models/chats');
const Users = require('../models/user');
const Group = require('../models/group');
const Members = require('../models/member');
const { Op } = require('sequelize');

exports.getUserChatPage = (req, res) => {
    res.sendFile('userChat.html', { root: 'views' });
};

exports.saveChats = async (req,res)=>{
    const {message} = req.body;
    const user = req.user;
    try {
        await Chats.create({
            message:message,
            userId:user.id
       })
       return response.status(200).json({ 
            message: "Message saved" 
        })

    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error'
        }); 
    }
}

exports.getChats = async (req,res)=>{
    try {
        const user = req.user;
        const chats = await Chats.findAll({where:{userId:user.id}});

        return res.status(200).json({
            message: 'Chats fetched successfully',
            chats: chats
        });
        
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error'
        }); 
    }
}

exports.getUsers = async (req,res)=>{
    try {
        const currentUser = req.user;
        const users = await Users.findAll({
            attributes: ['id', 'username'],
            where: {
                id: {
                    [Op.not]: currentUser.id 
                }
            }
        });
        return res.status(200).json({
            message: 'Users fetched successfully',
            users: users
        });
        
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error'
        }); 
    }
}

exports.createGroup = async (req,res)=>{
    const user = req.user;
    const {groupname,userIds} = req.body;
    console.log('in11');
    try {
        
        const group = await Group.create({name:groupname});
        console.log('in1');
        //making current user as a admin of a group
        await Members.create({
            admin: true,
            userId: user.id,
            groupId: group.id,
        });
        console.log('in2');
        await group.addUsers(userIds);
        console.log('in3');
        res.status(200).json({
            message: 'Group created successfully',
            group: group,
        });
        
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error'
        }); 
    }
}