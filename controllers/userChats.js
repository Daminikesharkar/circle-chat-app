const Chats = require('../models/chats');
const Users = require('../models/user');
const Group = require('../models/group');
const Members = require('../models/member');
const { Op } = require('sequelize');

exports.getUserChatPage = (req, res) => {
    res.sendFile('userChat.html', { root: 'views' });
};

exports.saveChats = async (req,res)=>{
    const {message,groupId} = req.body;
    const user = req.user;
    try {
        const chat = await Chats.create({
            message:message,
            userId:user.id,
            groupId:groupId
       })
       const responseObj = {
            message: chat.message,
            createdAt: chat.createdAt,
            userId: chat.userId,
            username: user.username,
            isCurrentUser:true
        };

        return res.status(200).json({ 
            message: "Message saved" ,
            chat:responseObj
        })

    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error'
        }); 
    }
}
exports.getGroupChats = async (req,res)=>{
    const {groupId} = req.query;
    try {
        
        const groupChats = await Chats.findAll({
            where: { groupId: groupId },
            attributes: ['message', 'createdAt','userId'],
            include: [{
                model: Users,
                attributes: ['username'] 
            }]
        });

        const chats = groupChats.map(chat => {
            const user = chat.user; 
            const username = user ? user.username : null; 
            const isCurrentUser = chat.userId === req.user.id;
            return {
                message: chat.message,
                createdAt: chat.createdAt,
                userId: chat.userId,
                username: username,
                isCurrentUser:isCurrentUser
            };
        });

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

exports.getUserGroups = async(req,res)=>{
    const user = req.user

    try {   
        console.log('in'); 
        const groupIds = await Members.findAll({
            where: { UserId: user.id },
            attributes: ['groupId']
        });
        const ids = groupIds.map(({ groupId }) => groupId);

        const userGroups = await Group.findAll({
            where: { id: ids }
        });

        if (userGroups.length > 0) {
            return res.status(200).json({ groups: userGroups });
        } else {
            return res.status(404).json({ message: 'No groups found for the current user' });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error'
        }); 
    }
}

exports.checkAdmin = async (req,res)=>{
    const { groupId } = req.query;
    const user = req.user; 

    try {
        const isAdmin = await Members.findOne({
            where: {
                userId: user.id,
                groupId: groupId,
                admin: true 
            }
        });        
        res.status(200).json({ isAdmin: !!isAdmin });  
              
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
}