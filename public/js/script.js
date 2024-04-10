const signInButton = document.getElementById("signin-form-btn");
const signUpButton = document.getElementById("signup-form-btn");
const loginPopup = document.getElementById("login-popup");
const signupPopup = document.getElementById("signup-popup");

signInButton.addEventListener("click", ()=>{
    loginPopup.style.display = "block";
});

signUpButton.addEventListener("click", ()=> {
    signupPopup.style.display = "block";
});

document.querySelectorAll(".close-popup").forEach(function(closeButton) {
    closeButton.addEventListener("click", function() {
        this.closest(".popup").style.display = "none";
    });
});

window.addEventListener("click", function(event) {
    if (event.target.classList.contains("popup")) {
        event.target.style.display = "none";
    }
});

//sign up
const signupName = document.getElementById('signup-username');
const signupEmail = document.getElementById('signup-email');
const signupMobile = document.getElementById('signup-mobile');
const signupPassword = document.getElementById('signup-password');

const signupForm = document.getElementById('signup-form');

signupForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    const userData = {
        username:signupName.value,
        email:signupEmail.value,
        mobilenumber:signupMobile.value,
        password:signupPassword.value
    }

    postUser(userData);
    signupForm.reset();
})

async function postUser(userData){
    try {
        const response = await axios.post('/addUser',userData,{
            validateStatus: function (status) {
                return status < 500;
            }
        });
        if (response.status === 200) {
            alert("Signed Up successfully, please login now!");
            window.location.href = `/`;
        }else if(response.status === 400) {
            alert(response.data.message);
            throw new Error("User already exists with this email" + response.status);
        }else {
            alert(response.data.message)
            throw new Error("Failed to add user" + response.status);
        }    
    } catch (error) {
        console.error("Error adding User", error.message);
    }
}

//login 
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password'); 

const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const userData = {
        email:loginEmail.value,
        password:loginPassword.value
    }

    loginUser(userData);
    loginForm.reset();
})

async function loginUser(userData){
    try {
        const response = await axios.post('/login', userData, {
            validateStatus: function (status) {
                return status < 500;
            }
        });

        if (response.status === 200) {
            alert(response.data.message)
        }else if(response.status === 400) {
            alert(response.data.message)
            throw new Error("Failed to log In:" + response.data.message);
        }else if(response.status === 401) {
            alert(response.data.message)
            throw new Error("Failed to log In:" + response.data.message);
        }
        
    } catch (error) {
        console.error("Error adding User", error.message);
    }
}