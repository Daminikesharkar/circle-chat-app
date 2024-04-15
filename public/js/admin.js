const popup = document.getElementById('groupInfoPopup');
const groupNameElement = document.getElementById('groupNameHeading');
const groupMembersList = document.getElementById('groupMembers');
const closeButton = document.getElementById('close-admin-popup');

export function adminFunctionality(group){
    console.log(group);
    const groupName = group.name; 
    const groupMembers = ["User 1", "User 2", "User 3"]; 

    groupNameElement.innerHTML = `Group: ${groupName}`;
    groupMembersList.innerHTML = groupMembers.map(member => `<li>${member}</li>`).join('');
  
    popup.style.display = 'block';

    closeButton.addEventListener('click', () => {
        popup.style.display = 'none';
    });
}