
debugger
// Function to handle adding a new post
document.getElementById('addPostForm').addEventListener('submit', async function(event){
    debugger
    event.preventDefault(); // Prevent default button action
    debugger
    const authorId = localStorage.getItem('UserID');
    debugger
 
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
        window.alert("Post created successfully:")
        console.log('Post created successfully:', result);
        
        // Optionally, close the modal or reset the form
        document.getElementById('addPostModal').style.display = 'none';
        document.getElementById('addPostForm').reset(); // Reset the form
    } catch (error) {
        console.error('Error creating post:', error);
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
                                <a href="blog-details.html"><i class="fas fa-comments"></i>${post.commentsCount} Comments</a>
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
                            <span class="sidebar__post-content-meta"><i class="fa fa-comments"></i>${post.commentsCount} Comments</span>
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


//blog details
debugger
    document.addEventListener('DOMContentLoaded', function () {
        debugger

        const postId =localStorage.getItem("PostID") /* Set the post ID dynamically, e.g., from the URL or a global variable */

        // Fetch the blog post data
        fetch(`https://localhost:7084/api/Blogs/getPostByID${postId}`) // Update with your API URL
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Populate the blog details section with the fetched data
                document.querySelector('.blog-details__title').textContent = data.title; // Assuming 'title' is a property
                document.querySelector('.blog-details__text-1').textContent = data.content1; // Assuming 'content1' is a property
                document.querySelector('.blog-details__text-2').textContent = data.content2; // Assuming 'content2' is a property
                document.querySelector('.blog-details__date p').innerHTML = new Date(data.date).toLocaleDateString(); // Format the date
                document.querySelector('.blog-details__meta li:first-child a').textContent = `by ${data.author}`; // Assuming 'author' is a property
                document.querySelector('.blog-details__meta li:nth-child(2) a').textContent = `${data.comments.length} Comments`; // Assuming 'comments' is an array

                // Loop through and append comments
                data.comments.forEach(comment => {
                    const commentHtml = `
                        <div class="comment-one__single">
                            <div class="comment-one__image">
                                <img src="${comment.image}" alt="Commenter Image">
                            </div>
                            <div class="comment-one__content">
                                <h3>${comment.name}</h3>
                                <p>${comment.message}</p>
                                <a href="blog-details.html" class="thm-btn comment-one__btn">Reply</a>
                            </div>
                        </div>`;
                    document.querySelector('.comment-one').insertAdjacentHTML('beforeend', commentHtml);
                });
            })
            .catch(error => {
                console.error('Error fetching blog post:', error);
                // Handle error, e.g., display a message
            });
    });

