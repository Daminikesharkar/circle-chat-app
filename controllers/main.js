const bcrypt = require('bcrypt');
const Users = require('../models/user');

exports.getIndex = (req, res) => {
    res.sendFile('index.html', { root: 'views' });
};

exports.postUser = async (req,res)=>{
    const {username,email,mobilenumber,password} = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password,10);
        const existingUser = await Users.findOne({where:{email:email}});

        if(existingUser){
            return res.status(400).json({
                message: 'User already exists with this email address'
            });
        }
        const createdUser = await Users.create({
            username:username,
            email:email,
            mobilenumber:mobilenumber,
            password:hashedPassword
        });

        if (createdUser) {
            return res.status(201).json({
                message: 'User added successfully',
                user: createdUser
            });
        }

    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error'
        });        
    }
}