document.addEventListener("DOMContentLoaded", function () {
    const addPostButton = document.getElementById("addPostButton");
    const addPostModal = document.getElementById("addPostModal");
    const closeModal = addPostModal.querySelector(".close");
  
    // Open the modal when the "Add Post" button is clicked
    addPostButton.addEventListener("click", function () {
      addPostModal.style.display = "block";
    });
  
    // Close the modal when the "x" button is clicked
    closeModal.addEventListener("click", function () {
      addPostModal.style.display = "none";
    });
  
    // Close the modal when clicking outside of it
    window.addEventListener("click", function (event) {
      if (event.target === addPostModal) {
        addPostModal.style.display = "none";
      }
    });
  });
 // Function to handle adding a new post
document.getElementById('addPostForm').addEventListener('submit', async function(event){
    
    event.preventDefault(); // Prevent default button action
    
    const authorId = localStorage.getItem('UserID');
    

    // Gather form data
    const formData = new FormData(document.getElementById('addPostForm')); // Create FormData from the form
    formData.append('AuthorID', authorId); // Add AuthorID to form data
    try {
        debugger
        // Send a POST request to the API
        const response = await fetch('https://localhost:7084/api/Blogs/createpostforAdmin', {
            method: 'POST',
            body: formData // Send the form data
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json(); // Parse the JSON response
        
        // Replace the alert with SweetAlert
        Swal.fire({
            title: 'Success!',
            text: "Post created successfully:",
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 100000, // الوقت بالمللي ثانية، هنا 3000 تعني 3 ثواني
            timerProgressBar: true // لعرض شريط التقدم
        });
        

        console.log('Post created successfully:', result);
        
        // Optionally, close the modal or reset the form
        document.getElementById('addPostModal').style.display = 'none';
        document.getElementById('addPostForm').reset(); // Reset the form
    } catch (error) {
        console.error('Error creating post:', error);
        
        // Optional: Show error message with SweetAlert
        Swal.fire({
            title: 'Error!',
            text: 'Error creating post: ' + error.message,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}); 

async function fetchPosts() {
    try {
        const response = await fetch('https://localhost:7084/api/Blogs/getAllBlogbost');
        const posts = await response.json();
console.log("posts",posts)
        const tableBody = document.querySelector('#posts-table tbody');
        tableBody.innerHTML = ''; // Clear any existing rows

        posts.forEach(post => {
            const row = document.createElement('tr');
            row.id = `post-${post.postId}`;
            row.innerHTML = `
                <td>${post.title}</td>
                <td>${post.author}</td>
                <td>${new Date(post.createdAt).toLocaleDateString()}</td>
                <td>${post.category}</td>
                <td class="actions">
                    ${!post.isConfirmed ? `
                        <button class="btn btn-primary btn-sm" onclick="approvePost(${post.postId})">Approve</button>
                        <button class="btn btn-danger btn-sm" onclick="rejectPost(${post.postId})">Reject</button>
                    ` : ''}
                </td>
                <td class="status">${post.isConfirmed ? 'Approved' : 'Pending'}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Call the function to display posts when the page loads
fetchPosts();

async function approvePost(postId) {
    if (!confirm("Are you sure you want to approve this post?")) return;

    try {
        const response = await fetch(`https://localhost:7084/api/Blogs/approve/${postId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const postRow = document.getElementById(`post-${postId}`);
            postRow.querySelector('.status').textContent = 'Approved';
            postRow.querySelector('.actions').innerHTML = ''; // Remove the buttons
        } else {
            alert("Failed to approve the post.");
        }
    } catch (error) {
        console.error("Error approving the post:", error);
        alert("An error occurred while approving the post.");
    }
}

async function rejectPost(postId) {
    if (!confirm("Are you sure you want to reject this post?")) return;

    try {
        const response = await fetch(`https://localhost:7084/api/Blogs/reject/${postId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const postRow = document.getElementById(`post-${postId}`);
            postRow.querySelector('.status').textContent = 'Rejected';
            postRow.querySelector('.actions').innerHTML = ''; // Remove the buttons
        } else {
            alert("Failed to reject the post.");
        }
    } catch (error) {
        console.error("Error rejecting the post:", error);
        alert("An error occurred while rejecting the post.");
    }
}

// Comments
async function fetchComments() {
    try {
        const response = await fetch('https://localhost:7084/api/Comments/GetComments');
        const comments = await response.json();
console.log("comments",comments)
        const tableBody = document.querySelector('#comments-table tbody');
        tableBody.innerHTML = ''; // Clear any existing rows

        comments.forEach(comment => {
            const row = document.createElement('tr');
            row.id = `comment-${comment.commentId}`;
            row.innerHTML = `
                <td>${comment.commentText}</td>
                <td>${comment.userName}</td>
                <td>${new Date(comment.createdAt).toLocaleDateString()}</td>
                <td class="actions">
                    ${!comment.isApproved ? `
                        <button class="btn btn-primary btn-sm" onclick="approveComment(${comment.commentId})">Approve</button>
                        <button class="btn btn-danger btn-sm" onclick="rejectComment(${comment.commentId})">Delete</button>
                    ` : ''}
                </td>
                <td class="status">${comment.isApproved ? 'Approved' : 'Pending'}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}

fetchComments();

async function approveComment(commentId) {
    if (!confirm("Are you sure you want to approve this comment?")) return;

    try {
        const response = await fetch(`https://localhost:7084/api/Comments/approve/${commentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const commentRow = document.getElementById(`comment-${commentId}`);
            commentRow.querySelector('.status').textContent = 'Approved';
            commentRow.querySelector('.actions').innerHTML = ''; // Remove the buttons
        } else {
            alert("Failed to approve the comment.");
        }
    } catch (error) {
        console.error("Error approving the comment:", error);
        alert("An error occurred while approving the comment.");
    }
}

async function rejectComment(commentId) {
    if (!confirm("Are you sure you want to reject this comment?")) return;

    try {
        const response = await fetch(`https://localhost:7084/api/Comments/reject/${commentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const commentRow = document.getElementById(`comment-${commentId}`);
            commentRow.querySelector('.status').textContent = 'Rejected';
            commentRow.querySelector('.actions').innerHTML = ''; // Remove the buttons
        } else {
            alert("Failed to reject the comment.");
        }
    } catch (error) {
        console.error("Error rejecting the comment:", error);
        alert("An error occurred while rejecting the comment.");
    }
}
