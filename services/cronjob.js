const Chat = require('../models/chats');
const ArchivedChat = require('../models/archievedchats');
const { CronJob } = require('cron');
const {Op} = require('sequelize');

exports.job = new CronJob(
    '0 0 */20 * *', 
    archiveOldRecords
);

async function archiveOldRecords() {
    try {
        const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);

        const oldChats = await Chat.findAll({
            where: {
            createdAt: {
                [Op.lt]: tenDaysAgo,
            },
            },
        });

        await ArchivedChat.bulkCreate(oldChats.map(chat => ({
            message: chat.message,
            userId: chat.userId,
            groupId: chat.groupId,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt
        })));

        await Chat.destroy({ where: { createdAt: { [Op.lt]: tenDaysAgo } } });       
        console.log('chats archived successfully.');

    } catch (error) {
        console.error('Error archiving chats', error.message);
    }
}