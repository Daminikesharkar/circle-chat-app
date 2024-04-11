const messageContainer = document.getElementById("messageContainer");
const messageInput = document.querySelector(".message_input");
const sendButton = document.querySelector(".send_button");

function addMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.innerText = message;
    
    messageContainer.insertBefore(messageElement, messageContainer.firstChild);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

sendButton.addEventListener('click',()=>{
    const chatData = {
        message:messageInput.value
    }
    postMessage(chatData);
    addMessage(chatData.message);
    messageInput.value = "";
})

async function postMessage(chatData){
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('/postMessage',chatData,{headers:{"Authorization":token}});

    } catch (error) {
        console.error("Error adding chats", error.message);
    }
}