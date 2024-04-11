const Chats = require('../models/chats');

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