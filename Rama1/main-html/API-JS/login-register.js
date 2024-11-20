

async function register(params) {
    debugger
    
    const url="https://localhost:7084/api/User/createAccount";
    var form=document.getElementById("form");
    event.preventDefault();
   
   
    var formData=new FormData(form);
    let repeatPass=document.getElementById("repeatPass").value;
    let password=document.getElementById("password").value
    if(repeatPass!=password){
        window.alert("The passwords you entered do not match. Please ensure both passwords are identical.");
        return;
    }
    let response=await fetch(url,{
        method:'POST',
        body:formData,
    })
    if(!response.ok){
window.alert("The email you entered is already in use. Please try a different one.");
    }
    let data=await response.json();
   
   
    window.location.href = "login.html";
   
    window.alert("You have successfully registered! Welcome aboard.");

}


async function login() {
    debugger
    const url = "https://localhost:7084/api/User/login";
    var form = document.getElementById("forml");
    event.preventDefault();
   
    var formData = new FormData(form);
    let response = await fetch(url, {
        method: 'POST',
        body: formData,
    });

    if (response.ok) {
        var result = await response.json();
        let token = sessionStorage.jwtToken = result.token;
        sessionStorage.UserID = result.userId;
        sessionStorage.UserRole = result.userRole; // Store user role in session storage

        console.log("token", token);

        // window.alert("User logged in successfully");
        sessionStorage.setItem('isLoggedIn', 'true'); // Set login status

        // Redirect based on user role
        if (result.userRole === 'admin') {
            window.location.href = '../Masterpiece-admin/admin/dashboard.html'; // Redirect to admin dashboard
        } else {
            window.location.href = 'index.html'; // Redirect to user index page
        }
    } else {
        window.alert("Email or password wrong");
    }
}


document.addEventListener("DOMContentLoaded", function() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn'); // Check login status from local storage
    
    // Regular header elements
    const signupLoginBtn = document.getElementById('signup-login-btn');
    const profileLogoutBtns = document.getElementById('profile-logout-btns');

    // Sticky header container (we'll use this to apply classes/changes to the sticky header)
    const stickyHeaderContent = document.querySelector('.sticky-header__content');

    // Function to update header buttons based on login status
    function updateHeaderButtons(isLoggedIn) {
        if (isLoggedIn === 'true') {
            // Logged in: Change Sign Up to Discover Activities and show Profile/Logout
            signupLoginBtn.innerText = "Discover Activities";
            signupLoginBtn.href = "activities.html";
            profileLogoutBtns.style.display = 'block';
            
            // Apply the same changes to the sticky header
            stickyHeaderContent.querySelector('.thm-btn').innerText = "Discover Activities";
            stickyHeaderContent.querySelector('.thm-btn').href = "activities.html";
            stickyHeaderContent.querySelector('.main-header-four__right__btn').style.display = 'block';
        } else {
            // Not logged in: Show Sign Up button and hide Profile/Logout
            signupLoginBtn.innerText = "Sign up";
            signupLoginBtn.href = "login.html";
            profileLogoutBtns.style.display = 'none';

            // Apply the same changes to the sticky header
            stickyHeaderContent.querySelector('.thm-btn').innerText = "Sign up";
            stickyHeaderContent.querySelector('.thm-btn').href = "login.html";
            stickyHeaderContent.querySelector('.main-header-four__right__btn').style.display = 'none';
        }
    }

    // Initial update on page load
    updateHeaderButtons(isLoggedIn);

    // Handle logout functionality for both headers
    function handleLogout() {
        sessionStorage.setItem('isLoggedIn', 'false');
        window.location.href = 'login.html';
    }

    // Add event listener to logout buttons
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }

    // Add event listener to sticky logout button
    stickyHeaderContent.querySelector('.fas.fa-sign-out-alt').addEventListener('click', function(e) {
        e.preventDefault();
        handleLogout();
    });
});

