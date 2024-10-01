async function fetchPosts() {
    debugger
    try {
        const response = await fetch('https://localhost:7084/api/Blogs/getAllBlogbost');
        const posts = await response.json();

        const tableBody = document.querySelector('#posts-table tbody');
        tableBody.innerHTML = ''; // Clear any existing rows

        posts.forEach(post => {
            debugger
            const row = document.createElement('tr');
            row.id=`post-${post.postId}`
            row.innerHTML = `
                <td>${post.title}</td>
                <td>${post.author}</td>
                <td>${new Date(post.createdAt).toLocaleDateString()}</td>
                <td>${post.category}</td>
                            

                <td class="actions">
                    <button onclick="approvePost(${post.postId})">Approve</button>
                    <button onclick="rejectPost(${post.postId})">Delete</button>
                </td>
                <td class="status">Pending</td> <!-- Initial status -->
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}
debugger
// Call the function to display posts when the page loads
fetchPosts();
async function approvePost(postId) {
    debugger
    const confirmAction = confirm("Are you sure you want to approve this post?");
    if (!confirmAction) {
        return;
    }

    try {
        debugger
        const response = await fetch(`https://localhost:7084/api/Blogs/approve/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
debugger
        if (response.ok) {
            debugger
            // Update the status and actions in the table row
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
    const confirmAction = confirm("Are you sure you want to reject this post?");
    if (!confirmAction) {
        return;
    }

    try {
        const response = await fetch(`https://localhost:7084/api/Blogs/reject/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // Update the status and actions in the table row
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



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//comments
async function fetchComments() {
    debugger
    try {
        const response = await fetch('https://localhost:7084/api/Comments/GetComments');
        const comments = await response.json();

        const tableBody = document.querySelector('#comments-table tbody');
        tableBody.innerHTML = ''; // Clear any existing rows

        comments.forEach(comment => {
            debugger
            const row = document.createElement('tr');
            row.id=`comment-${comment.commentId}`
            row.innerHTML = `
                <td>${comment.commentText}</td>
                <td>${comment.userName}</td>
                <td>${new Date(comment.createdAt).toLocaleDateString()}</td>
            
                            

                <td class="actions">
                    <button onclick="approveComment(${comment.postId})">Approve</button>
                    <button onclick="rejectComment(${comment.postId})">Delete</button>
                </td>
                <td class="status">Pending</td> <!-- Initial status -->
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}
fetchComments();
async function approveComment(commentId) {
    debugger
    const confirmAction = confirm("Are you sure you want to approve this comment?");
    if (!confirmAction) {
        return;
    }

    try {
        debugger
        const response = await fetch(`https://localhost:7084/api/Comments/approve/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
debugger
        if (response.ok) {
            debugger
            // Update the status and actions in the table row
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
    const confirmAction = confirm("Are you sure you want to reject this post?");
    if (!confirmAction) {
        return;
    }

    try {
        const response = await fetch(`https://localhost:7084/api/Comments/reject/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // Update the status and actions in the table row
            const commentRow = document.getElementById(`comment-${commentId}`);
            commentRow.querySelector('.status').textContent = 'Rejected';
            commentRow.querySelector('.actions').innerHTML = ''; // Remove the buttons
        } else {
            alert("Failed to reject the post.");
        }
    } catch (error) {
        console.error("Error rejecting the post:", error);
        alert("An error occurred while rejecting the post.");
    }
}
