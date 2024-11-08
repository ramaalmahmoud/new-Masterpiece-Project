document.getElementById('userSearchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    fetchUsers();
});

async function fetchUsers() {
    const search = document.getElementById('searchInput').value;
    const status = document.getElementById('statusSelect').value;

    const response = await fetch(`https://localhost:7084/api/User/getUsers?search=${search}&status=${status}`);
    const users = await response.json();

    const tableBody = document.querySelector('#userTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows
console.log("users",users)
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="/Back End/master-piece-project/master-piece-project/Uploads/Profiles/${user.profilePicture || 'default-pic.jpg'}" alt="Profile" class="img-thumbnail" style="width: 50px;"></td>
            <td>${user.fullName}</td>
            <td>${user.email}</td>
            <td>${user.userRole}</td>
            <td>${user.status}</td>
            <td>
               <button class="btn btn-icon btn-link op-8 me-1" onclick="openGmail('${user.email}')">
  <i class="far fa-envelope"></i>
</button>
                <button class="btn btn-icon btn-link btn-danger op-8" onclick="updateStatus(${user.userId}, 'Inactive')">
                    <i class="fas fa-ban"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

async function updateStatus(userId, status) {
    const response = await fetch(`https://localhost:7084/api/User/updateStatus/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(status)
    });

    if (response.ok) {
        alert('Status updated successfully');
        fetchUsers(); // Refresh the user list
    } else {
        alert('Failed to update status');
    }
}

async function openGmail(email) {
    // Implement your logic for sending an email to the user
    debugger
    const subject = "Response to Your Contact Message";
    const body = "Hello, your message has been received.";
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Load users initially
fetchUsers();