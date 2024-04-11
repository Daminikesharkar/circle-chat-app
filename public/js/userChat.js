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

async function displayChats(){
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/getMessages',{headers:{"Authorization":token}});

        const length = Object.keys(response.data.chats).length;
        for(let i=0;i<length;i++){
            const message = response.data.chats[i].message;
            addMessage(message);
        }

    } catch (error) {
        console.error("Error fetching chats", error.message);
    }
}

window.addEventListener('load',()=>{
    displayChats();
    setInterval(displayChats, 5000);
})