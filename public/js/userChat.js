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

sendButton.addEventListener("click", function() {
const message = messageInput.value.trim(); 
if (message !== "") { 
    addMessage(message); 
    messageInput.value = ""; 
}
});