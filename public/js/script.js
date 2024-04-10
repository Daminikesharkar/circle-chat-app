const signInButton = document.getElementById('signin-form');
const signUpButton = document.getElementById('signup-form');

const signInPopup = document.getElementById('signin-popup');
const signUpPopup = document.getElementById('signup-popup');

const closeButtons = document.querySelectorAll('.popup .close');

function showPopup(popup) {
  popup.style.display = 'block';
}
function hidePopup(popup) {
  popup.style.display = 'none';
}
signInButton.addEventListener('click', () => {
  showPopup(signInPopup);
});

signUpButton.addEventListener('click', () => {
  showPopup(signUpPopup);
});

closeButtons.forEach(button => {
  button.addEventListener('click', () => {
    const popup = button.parentElement.parentElement;
    hidePopup(popup);
  });
});
