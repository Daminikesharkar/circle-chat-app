exports.getUserChatPage = (req, res) => {
    res.sendFile('userChat.html', { root: 'views' });
};