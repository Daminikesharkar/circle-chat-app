import * as adminFunctions from './admin.js';
const socket = io(window.location.origin);

socket.on('group-message', (groupId) => { 
    if(document.querySelector('.message_input_container').dataset.groupId === groupId) {
        displayChats(groupId)
    }    
})

const messageContainer = document.getElementById("messageContainer");
const messageInput = document.querySelector(".message_input");
const sendButton = document.querySelector(".send_button");

function addMessage(chat,isImage) {
    const chatElement = document.createElement("div");

    if (chat.isCurrentUser) {
        chatElement.classList.add("message-right");
    } else {
        chatElement.classList.add("message-left");
    }

    if(isImage){
        const messageContent = `
            <div class="username">${chat.username}</div>
            <div class="chat"><a href="${chat.message}" target="_blank"><img src="${chat.message}" class="chat-image"></a></div>
            <div class="created-at">${chat.createdAt}</div>
        `;
        chatElement.innerHTML = messageContent;
    }else{
        const messageContent = `
            <div class="username">${chat.username}</div>
            <div class="chat">${chat.message}</div>
            <div class="created-at">${chat.createdAt}</div>
        `;
        chatElement.innerHTML = messageContent;
    }

    messageContainer.insertBefore(chatElement, messageContainer.firstChild);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

sendButton.addEventListener('click',()=>{
    const messageInputBox = document.querySelector('.message_input_container'); 
    const groupId = messageInputBox.dataset.groupId;
    
    const chatData = {
        message:messageInput.value,
        groupId:groupId
    }
    postMessage(chatData);
    messageInput.value = "";

    socket.emit('new-group-message', groupId);
})

const fileUploadIcon = document.getElementById('fileUploadIcon');
const fileInput = document.getElementById('fileInput');

fileUploadIcon.addEventListener('click', () => {
    fileInput.click(); 
});

fileInput.addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const messageInputBox = document.querySelector('.message_input_container'); 
    const groupId = messageInputBox.dataset.groupId;

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('image', file);
        formData.append('groupId', groupId);

        postImage(formData);
        fileInput.value = '';
    }

    socket.emit('new-group-message', groupId);
}

async function postImage(formData){
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('/postImage',formData,{headers:{"Authorization":token}});
        addMessage(response.data.chat,true);
    } catch (error) {
        console.error("Error adding chats", error.message);
    }
}
async function postMessage(chatData){
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('/postMessage',chatData,{headers:{"Authorization":token}});
        addMessage(response.data.chat,false);
    } catch (error) {
        console.error("Error adding chats", error.message);
    }
}
function isImageURL(url) {
    const imageExtensions = /\.(jpg|jpeg|png|gif|bmp)$/i;
    return imageExtensions.test(url);
}

async function displayChats(groupId){
    try {
        messageContainer.innerHTML = '';
        const token = localStorage.getItem('token');
        const response = await axios.get(`/getGroupMessages?groupId=${groupId}`,{headers:{"Authorization":token}});

        const length = Object.keys(response.data.chats).length;
        for(let i=0;i<length;i++){
            const chat = response.data.chats[i];
            addMessage(chat,isImageURL(chat.message));
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
    userDiv.dataset.user = JSON.stringify(user);
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

createGroupBtn.addEventListener('click',async ()=>{
    const groupName = groupNameInput.value.trim();

    const selectedUsers = document.querySelectorAll('#addedUserList .user');
    const users = Array.from(selectedUsers).map(user => JSON.parse(user.dataset.user));

    const userIds = users.map(user => user.id);
    const data = {
        groupname : groupName,
        userIds:userIds
    }
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('/createGroup',data, { headers: { "Authorization": token } });
        const group = response.data.group;

        addGroupInUi(group);
    } catch (error) {
        console.error("Error creating group", error.message);
    }
})

function addGroupInUi(group){
    const groupListItem = document.createElement('li');
    groupListItem.classList.add('item');
    groupListItem.dataset.group = JSON.stringify(group); 

    const groupLink = document.createElement('a');
    groupLink.href = '#';
    groupLink.classList.add('nav_link');

    const groupInfo = document.createElement('div');
    groupInfo.classList.add('group_info');

    const groupProfileImage = document.createElement('img');
    groupProfileImage.src = 'images/user.avif'; 
    groupProfileImage.alt = 'Group Profile Image';
    groupProfileImage.classList.add('group_profile_image');

    const groupNameSpan = document.createElement('span');
    groupNameSpan.classList.add('group_name');
    groupNameSpan.textContent = group.name;

    groupInfo.appendChild(groupProfileImage);
    groupInfo.appendChild(groupNameSpan);
    groupLink.appendChild(groupInfo);
    groupListItem.appendChild(groupLink);

    const groupsMenu = document.getElementById('groups');
    groupsMenu.appendChild(groupListItem);

    document.getElementById('createGroupPopup').style.display = 'none';
}

//open particular group
const groupsMenu = document.getElementById('groups');
groupsMenu.addEventListener('click', (event) => {
    const clickedElement = event.target;
    if (clickedElement.classList.contains('nav_link') || clickedElement.classList.contains('group_name')) {
        const groupListItem = clickedElement.closest('.item');
        if (groupListItem) {

            const allGroupItems = document.querySelectorAll('#groups .item');
            allGroupItems.forEach(item => {
                item.classList.remove('selected');
            });
            groupListItem.classList.add('selected');

            const groupData = groupListItem.dataset.group;
            const group = JSON.parse(groupData);
            openGroup(group);
        }
    }
});

async function openGroup(group){
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/checkAdmin?groupId=${group.id}`, { headers: { "Authorization": token } });
        const isAdmin = response.data.isAdmin;

        const activeGroup = document.getElementById('active_group');
        const messageInputBox = document.querySelector('.message_input_container'); 
        const messageContainer = document.getElementById('messageContainer'); 

        const groupInfo = activeGroup.querySelector('.group_info');
        const groupName = groupInfo.querySelector('.group_name');
        const editIcon = groupInfo.querySelector('.bx-edit');

        groupName.textContent = group.name;
        messageInputBox.dataset.groupId = group.id;

        if (isAdmin) {
            editIcon.style.display = 'block'; 
        } else {
            editIcon.style.display = 'none'; 
        }
        activeGroup.style.display = 'block'; 
        messageInputBox.style.display = 'flex'; 
        messageContainer.style.display = 'flex';         

        editIcon.addEventListener('click', () => {
            adminFunctions.adminFunctionality(group);
        });

        displayChats(group.id);

    } catch (error) {
        console.error("Failed to open groups", error.message);
    }
}

//display all users groups
async function displayUserGroups(){
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/getUserGroups', { headers: { "Authorization": token } });
        const userGroups = response.data.groups;
    
        userGroups.forEach(group => {
            addGroupInUi(group);
        });       
    } catch (error) {
        console.error("Error getting user groups", error.message);
    }
}

window.addEventListener('load',()=>{
    displayUserGroups();
})