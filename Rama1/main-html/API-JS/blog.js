

// Function to handle adding a new post
document.getElementById('addPostForm').addEventListener('submit', async function(event){
    
    event.preventDefault(); // Prevent default button action
    
    const authorId = localStorage.getItem('UserID');
    

    // Gather form data
    const formData = new FormData(document.getElementById('addPostForm')); // Create FormData from the form
    formData.append('AuthorID', authorId); // Add AuthorID to form data
    try {
        // Send a POST request to the API
        const response = await fetch('https://localhost:7084/api/Blogs/createpost', {
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




//display blog
const blogPostsContainer = document.getElementById('blog-posts');
const recentArticlesContainer = document.getElementById('recent-articles');

// Function to fetch and display blog posts
async function fetchBlogPosts() {
    debugger
    try {
        const response = await fetch('https://localhost:7084/api/Blogs/confirmedposts'); // Adjust the URL as necessary
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const posts = await response.json();
console.log(posts);
        // Clear existing content
        blogPostsContainer.innerHTML = '';
        recentArticlesContainer.innerHTML = '';
debugger
        // Populate the blog posts
        posts.forEach(post => {
            const postHTML = `
                <div class="blog-sidebar__single">
                    <div class="blog-sidebar__img">
                        <img src="../Back End/master-piece-project/master-piece-project/Uploads/Blogs/${post.image}" alt=""> <!-- Change made here -->
                        <div class="blog-sidebar__date">
                            <p>${new Date(post.createdAt).getDate()}<br>${new Date(post.createdAt).toLocaleString('default', { month: 'short' })}</p>
                        </div>
                    </div>
                    <div class="blog-sidebar__content">
                        <ul class="blog-sidebar__meta list-unstyled">
                            <li>
                                <a href="blog-details.html"><i class="fas fa-user-circle"></i>by ${post.authorName}</a>
                            </li>
                            <li>
                                <a href="blog-details.html"><i class="fas fa-comments"></i>${post.commentCount} Comments</a>
                            </li>
                        </ul>
                        <h3 class="blog-sidebar__title"><a href="blog-details.html">${post.title}</a></h3>
                        <p class="blog-sidebar__text">${post.content.slice(0, 100)}...</p>
                        <div class="blog-sidebar__btn">
                            <a onclick="storePostID(${post.postId})" href="blog-details.html"><span class="icon-right-arrow"></span>Read More </a>
                        </div>
                    </div>
                </div>
            `;
            blogPostsContainer.insertAdjacentHTML('beforeend', postHTML);

            // Populate recent articles
            const recentArticleHTML = `
                <li>
                    <div class="sidebar__post-image">
                        <img src="${post.image}" alt="">
                    </div>
                    <div class="sidebar__post-content">
                        <h3>
                            <span class="sidebar__post-content-meta"><i class="fa fa-comments"></i>${post.commentCount} Comments</span>
                            <a  href="blog-details.html">${post.title}</a>
                        </h3>
                    </div>
                </li>
            `;
            recentArticlesContainer.insertAdjacentHTML('beforeend', recentArticleHTML);
        });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
    }
}

function storePostID(postId){
localStorage.PostID=postId;
}
// Call the function to fetch posts on page load
document.addEventListener('DOMContentLoaded', fetchBlogPosts);

// Load more functionality (if needed)
document.getElementById('load-more').addEventListener('click', (event) => {
    event.preventDefault();
    // Implement loading more posts logic here
});

// Function to fetch and display blog posts based on a search term
async function searchBlogPosts(searchTerm) {
    debugger
    try {
        // Encode the search term to ensure it's safe for use in a URL
        const encodedSearchTerm = encodeURIComponent(searchTerm);

        // Fetch the search results from the server
        const response = await fetch(`https://localhost:7084/api/Blogs/search?searchTerm=${encodedSearchTerm}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const posts = await response.json();
        displayBlogPosts(posts);
    } catch (error) {
        console.error('Error searching blog posts:', error);
    }
}

// Function to display blog posts
function displayBlogPosts(posts) {
    debugger
    const blogPostsContainer = document.getElementById('blog-posts');
    const recentArticlesContainer = document.getElementById('recent-articles');

    // Clear existing content
    blogPostsContainer.innerHTML = '';
    recentArticlesContainer.innerHTML = '';

    posts.forEach(post => {
        const postHTML = `
            <div class="blog-sidebar__single">
                <div class="blog-sidebar__img">
                    <img src="../Back End/master-piece-project/master-piece-project/Uploads/Blogs/${post.image}" alt="">
                    <div class="blog-sidebar__date">
                        <p>${new Date(post.createdAt).getDate()}<br>${new Date(post.createdAt).toLocaleString('default', { month: 'short' })}</p>
                    </div>
                </div>
                <div class="blog-sidebar__content">
                    <ul class="blog-sidebar__meta list-unstyled">
                        <li>
                            <a href="blog-details.html"><i class="fas fa-user-circle"></i>by ${post.authorName}</a>
                        </li>
                        <li>
                            <a href="blog-details.html"><i class="fas fa-comments"></i>${post.commentCount} Comments</a>
                        </li>
                    </ul>
                    <h3 class="blog-sidebar__title"><a href="blog-details.html">${post.title}</a></h3>
                    <p class="blog-sidebar__text">${post.content.slice(0, 100)}...</p>
                    <div class="blog-sidebar__btn">
                        <a onclick="storePostID(${post.postId})" href="blog-details.html"><span class="icon-right-arrow"></span>Read More </a>
                    </div>
                </div>
            </div>
        `;
        blogPostsContainer.insertAdjacentHTML('beforeend', postHTML);

        // Populate recent articles
        const recentArticleHTML = `
            <li>
                <div class="sidebar__post-image">
                    <img src="${post.image}" alt="">
                </div>
                <div class="sidebar__post-content">
                    <h3>
                        <span class="sidebar__post-content-meta"><i class="fa fa-comments"></i>${post.commentCount} Comments</span>
                        <a href="blog-details.html">${post.title}</a>
                    </h3>
                </div>
            </li>
        `;
        recentArticlesContainer.insertAdjacentHTML('beforeend', recentArticleHTML);
    });
}

function storePostID(postId) {
    localStorage.PostID = postId;
}

// Event listener for the search form
document.getElementById('searchForm').addEventListener('submit', function(event) {
    debugger
    event.preventDefault(); // Prevent the default form submission

    const searchTerm = document.getElementById('searchInput').value;
    searchBlogPosts(searchTerm); // Fetch blog posts with the search term
});




