document.addEventListener('DOMContentLoaded', function() {
    
    const userId = sessionStorage.getItem("UserID"); // Use the actual user ID from session or context

    fetch(`https://localhost:7084/api/Profile/api/user/${userId}`)
        .then(response => response.json())
        .then(data => {
            document.querySelector('#username').innerText = data.fullName;
            document.querySelector('#email').innerText = data.email;
            document.querySelector('#profilePicture').src = `../Back End/master-piece-project/master-piece-project/Uploads/${data.profilePicture}`;
            document.querySelector('#fullName').value = data.fullName;
            document.querySelector('#phoneNumber').value = data.phoneNumber;
            document.querySelector('#img-profile').src = `data:image/png;base64,${data.profilePicture}`;


        });

        
});

document.addEventListener("DOMContentLoaded", function() {
    const userId = sessionStorage.getItem("UserID"); // Replace with actual user ID (you can get this from a logged-in user session or token)
    
    // Fetch Blog Posts
    fetch(`https://localhost:7084/api/Blogs/user/${userId}/blogposts`)
        .then(response => response.json())
        .then(data => {
            const blogPostsContainer = document.getElementById("blogPosts");
            blogPostsContainer.innerHTML = ""; // Clear existing content
            data.forEach(post => {
                const listItem = `<li><a href="/blog/${post.id}" class="profile__link">${post.title}</a></li>`;
                blogPostsContainer.insertAdjacentHTML("beforeend", listItem);
            });
        })
        .catch(error => console.error('Error fetching blog posts:', error));

    // Fetch Activities
    fetch(`https://localhost:7084/api/Activities/user/${userId}/activities`)
        .then(response => response.json())
        .then(data => {
            const activitiesContainer = document.getElementById("activities");
            activitiesContainer.innerHTML = ""; // Clear existing content
            data.forEach(activity => {
                const listItem = `
                    <li>

                        <a onclick="storeID(${activity.activityId})" href="activity-details.html?id=${activity.activityId}" class="profile__link">
                            <h4>${activity.activityTitle}</h4>
                           
                        </a>
                    </li>`;
                activitiesContainer.insertAdjacentHTML("beforeend", listItem);
            });
        })
        .catch(error => console.error('Error fetching activities:', error));

    // Fetch Orders
    fetch(`https://localhost:7084/api/Orders/user/${userId}/orders`)
        .then(response => response.json())
        .then(data => {
            const ordersContainer = document.getElementById("orders");
            ordersContainer.innerHTML = ""; // Clear existing content
            data.forEach(order => {
                const statusClass = order.orderStatus === "Completed" ? "completed" : "in-progress";
                const listItem = `<li>Order #${order.orderId} - <span class="status ${statusClass}">${order.orderStatus}</span></li>`;
                ordersContainer.insertAdjacentHTML("beforeend", listItem);
            });
        })
        .catch(error => console.error('Error fetching orders:', error));
});

document.querySelector('#editProfileForm').addEventListener('submit', function(event) {
    
    event.preventDefault();

    const userId = sessionStorage.getItem("UserId"); // Use the actual user ID
    const formData = {
        fullName: document.querySelector('#fullName').value,
        phoneNumber: document.querySelector('#phoneNumber').value,
        phoneNumber: document.querySelector('#profilePicture').value
    };

    fetch(`https://localhost:7084/api/Profile/api/user/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Profile updated successfully!');
    })
    .catch(error => console.error('Error:', error));
});


document.getElementById('changePasswordForm').addEventListener('submit', async function(event) {
    debugger
    event.preventDefault();

    const url = "https://localhost:7084/api/User/change-password";
    const userId = sessionStorage.getItem('UserID');

    const formData = {
        userId: userId,
        currentPassword: document.getElementById('currentPassword').value,
        newPassword: document.getElementById('newPassword').value,
        confirmNewPassword: document.getElementById('confirmNewPassword').value
    };

    if (formData.newPassword !== formData.confirmNewPassword) {
        window.alert("New password and confirm new password do not match.");
        return;
    }

    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });

    if (response.ok) {
        window.alert("Password changed successfully.");
        document.getElementById('changePasswordForm').reset();
        var modal = bootstrap.Modal.getInstance(document.getElementById('changePasswordModal'));
        modal.hide();
    } else {
        const error = await response.text();
        window.alert(`Error: ${error}`);
    }
});
