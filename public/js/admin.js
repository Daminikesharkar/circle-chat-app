const popup = document.getElementById('groupInfoPopup');
const closeButton = document.getElementById('close-admin-popup');
const groupNameElement = document.getElementById('groupNameHeading');
const groupMembersList = document.getElementById('groupMembers');
const remainingUsersList = document.getElementById('remainingusers');
const newlyAddedUsersList = document.getElementById('newlyaddedusers');
const updateButton = document.getElementById('updateButton');

export async function adminFunctionality(group){
    try {
        const token = localStorage.getItem('token');
        const groupMembersResponse = await axios.get(`/getGroupUsers?groupId=${group.id}`,{headers:{"Authorization":token}});
        const groupMembers = groupMembersResponse.data.users;

        const remainingUsersResponse = await axios.get(`/getRemainingUsers?groupId=${group.id}`,{headers:{"Authorization":token}});
        const remainingUsers = remainingUsersResponse.data.users;

        groupNameElement.innerHTML = `Group Name: ${group.name}`;
        groupMembersList.innerHTML = groupMembers.map(member => `<li data-user=${JSON.stringify(member)}>${member.username} <button class="group-remove-btn">Remove</button> <button class="make-admin-btn">Make Admin</button></li>`).join('');    
        remainingUsersList.innerHTML = remainingUsers.map(user => `<li data-user=${JSON.stringify(user)}>${user.username} <button class="add-btn">Add</button></li>`).join('');

    } catch (error) {
        console.error("Error fetching users", error.message);
    }

    popup.style.display = 'block';
    closeButton.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-btn') || event.target.classList.contains('group-remove-btn') || event.target.classList.contains('add-btn') || event.target.classList.contains('make-admin-btn')) {
            handleButtonClick(event,group);
        }
    });

    updateButton.addEventListener('click', () => {
        console.log('Update button clicked');
        popup.style.display = 'none'; 
        
        const groupMembers = [];
        const listItems = newlyAddedUsersList.querySelectorAll('li');

        listItems.forEach(listItem => {
            const userDataString = listItem.getAttribute('data-user');
            const userData = JSON.parse(userDataString);
            groupMembers.push(userData.userId);
        });
        updateGroup(groupMembers,group);
    });
}
function handleButtonClick(event,group) {
    const target = event.target;
    if (target.classList.contains('group-remove-btn')) {
        const listItem = target.closest('li');
        const userDataString = listItem.getAttribute('data-user'); 
        const userData = JSON.parse(userDataString); 
        listItem.remove(); 
        removeUserFromGroup(userData,group);
        remainingUsersList.innerHTML += `<li data-user=${JSON.stringify(userData)}>${userData.username} <button class="add-btn">Add</button></li>`;

    }else if (target.classList.contains('remove-btn')) {
        const listItem = target.closest('li');
        const userDataString = listItem.getAttribute('data-user'); 
        const userData = JSON.parse(userDataString); 
        listItem.remove(); 
        remainingUsersList.innerHTML += `<li data-user=${JSON.stringify(userData)}>${userData.username} <button class="add-btn">Add</button></li>`;

    }else if (target.classList.contains('add-btn')) {
        const listItem = target.closest('li');
        const userDataString = listItem.getAttribute('data-user'); 
        const userData = JSON.parse(userDataString); 
        listItem.remove(); 

        newlyAddedUsersList.innerHTML += `<li data-user=${JSON.stringify(userData)}>${userData.username} <button class="remove-btn">Remove</button> <button class="make-admin-btn">Make Admin</button></li>`;

    }else if (target.classList.contains('make-admin-btn')) {
        const listItem = target.closest('li');
        const userDataString = listItem.getAttribute('data-user'); 
        const userData = JSON.parse(userDataString); 
        const makeAdminButton = target;

        makeUserAdmin(userData,group.id);
        makeAdminButton.remove();
    }
}
async function makeUserAdmin(userData,groupId){
    try {
        const data = {
            userId:userData.userId,
            groupId:groupId
        }
        const token = localStorage.getItem('token');
        const response = await axios.post('/makeAdmin',data,{headers:{"Authorization":token}});

    } catch (error) {
        console.error("Error making user admin", error.message);
    }
}
async function updateGroup(groupMembers,group){
    try {
        const data = {
            groupId:group.id,
            groupMembers:groupMembers
        }

        const token = localStorage.getItem('token');
        const response = await axios.post('/updateGroup',data,{headers:{"Authorization":token}});
        alert(response.data.message);
        newlyAddedUsersList.innerHTML = '';

    } catch (error) {
        console.error("Error updating group", error.message);
    }
}
async function removeUserFromGroup(userData,group){  
    try {
        const data = {
            userId:userData.userId,
            groupId:group.id
        }
        const token = localStorage.getItem('token');
        const response = await axios.post('/removeUserFromGroup',data,{headers:{"Authorization":token}});
        alert(response.data.message);

    } catch (error) {
        console.error("Error updating group", error.message);
    }
}