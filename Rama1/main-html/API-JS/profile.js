document.addEventListener('DOMContentLoaded', function() {
    debugger
    const userId = 1; // Use the actual user ID from session or context
debugger
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


document.querySelector('#editProfileForm').addEventListener('submit', function(event) {
    debugger
    event.preventDefault();

    const userId = 1; // Use the actual user ID
    const formData = {
        fullName: document.querySelector('#fullName').value,
        phoneNumber: document.querySelector('#phoneNumber').value,
        phoneNumber: document.querySelector('#profilePicture').value
    };
debugger
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
