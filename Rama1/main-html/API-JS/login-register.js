async function login() {
    debugger
    const url ="https://localhost:7084/api/User/login";
    var form=document.getElementById("forml");
    event.preventDefault();
   
    var formData=new FormData(form);
    let response=await fetch(url,{
        method:'POST',
        body:formData,
    });
    var result= await response.json();

    let token = localStorage.jwtToken = result.token;
    localStorage.UserID = result.userId;
    console.log("token", token)

    if(response.ok){
        window.alert("User logged in successfully");
        localStorage.setItem('isLoggedIn', 'true'); // Set login status
        window.location.href ='index.html';
    } else {
        window.alert("Email or password wrong");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn'); // Check login status from local storage
    const signupLoginBtn = document.getElementById('signup-login-btn');
    const profileLogoutBtns = document.getElementById('profile-logout-btns');

    if (isLoggedIn === 'true') {
        // Hide Sign up/Login button, show Profile/Logout buttons
        signupLoginBtn.innerText = "Discover Activities"; // Change text to "Discover Activities"
        signupLoginBtn.href = "activities.html"; // Change the link to activities page
        profileLogoutBtns.style.display = 'block'; // Show profile/logout buttons
    } else {
        // Show Sign up/Login button, hide Profile/Logout buttons
        signupLoginBtn.style.display = 'block';
        profileLogoutBtns.style.display = 'none';
    }

    // Handle logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // Remove login status from localStorage
        localStorage.setItem('isLoggedIn', 'false');
        // Optionally redirect to login page or refresh
        window.location.href = 'login.html';
    });
});

