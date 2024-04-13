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

//create groups
const createGroup = document.getElementById('create_group_btn');

createGroup.addEventListener('click',()=>{
    document.getElementById('createGroupPopup').style.display = 'block';
    displayAllUsers();
})
  
document.querySelector('.close-btn').addEventListener('click', function() {
    document.getElementById('createGroupPopup').style.display = 'none';
});

async function displayAllUsers() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/getAllUsers', { headers: { "Authorization": token } });

        const allUsers = response.data.users;
        const allUserListElement = document.getElementById('allUserList');
        allUserListElement.innerHTML = '';

        allUsers.forEach((user, index) => {
            const userDiv = createUserElement(user, index + 1, false);
            allUserListElement.appendChild(userDiv);
        });

    } catch (error) {
        console.error("Error fetching Users", error.message);
    }
}

function createUserElement(user, index, added) {
    const userDiv = document.createElement('div');
    userDiv.classList.add('user');
    const userSpan = document.createElement('span');
    userSpan.textContent = `${index}. ${user.username}`;
    userDiv.appendChild(userSpan);

    const btnText = added ? 'Remove' : 'Add';
    const addRemoveBtn = document.createElement('button');
    addRemoveBtn.textContent = btnText;
    addRemoveBtn.classList.add('add-remove-btn');
    addRemoveBtn.addEventListener('click', () => {
        if (added) {
            userDiv.remove();
            const originalUserDiv = userDiv.originalUserDiv;

            const addRemoveBtn = createUserButton(originalUserDiv, user, false);
            originalUserDiv.appendChild(addRemoveBtn);
        } else {
            const addedUserListElement = document.getElementById('addedUserList');
            const addedUserDiv = createUserElement(user, '', true);
            addedUserListElement.appendChild(addedUserDiv);

            addedUserDiv.originalUserDiv = userDiv;
            addRemoveBtn.remove();
        }
    });
    userDiv.appendChild(addRemoveBtn);
    return userDiv;
}

function createUserButton(userDiv, user, added) {
    const addRemoveBtn = document.createElement('button');
    addRemoveBtn.textContent = added ? 'Remove' : 'Add';
    addRemoveBtn.classList.add('add-remove-btn');
    addRemoveBtn.addEventListener('click', () => {
        if (added) {
            userDiv.remove();
            const originalUserDiv = userDiv.originalUserDiv;

            const addRemoveBtn = createUserButton(originalUserDiv, user, false);
            originalUserDiv.appendChild(addRemoveBtn);
        } else {
            const addedUserListElement = document.getElementById('addedUserList');
            const addedUserDiv = createUserElement(user, '', true);
            addedUserListElement.appendChild(addedUserDiv);

            addedUserDiv.originalUserDiv = userDiv;
            addRemoveBtn.remove();
        }
    });
    return addRemoveBtn;
}

const groupNameInput = document.getElementById('groupName');
const createGroupBtn = document.querySelector('.create-group-btn');

groupNameInput.addEventListener('input', () => {
  if (groupNameInput.value.trim() !== '') {
    createGroupBtn.removeAttribute('disabled');
  } else {
    createGroupBtn.setAttribute('disabled', true);
  }
});


window.addEventListener('load',()=>{
    displayChats();
})