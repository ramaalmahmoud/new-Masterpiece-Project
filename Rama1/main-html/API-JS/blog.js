
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


// // Example: Fetching blog post data dynamically
// async function fetchBlogPost(postId) {
//     debugger
//     try {
//         const response = await fetch(`https://localhost:7084/api/Blogs/getPostByID${postId}`);
//         const post = await response.json();
//         renderBlogPost(post);
//     } catch (error) {
//         console.error('Error fetching blog post:', error);
//     }
// }
// debugger
// function renderBlogPost(post) {
//     // Populate the blog details with the fetched data
//     document.querySelector('.blog-details__img img').src = `../Back End/master-piece-project/master-piece-project/Uploads/Blogs/${post.image}`;
//     document.querySelector('.blog-details__date p').innerHTML = formatDate(new Date(post.createdAt).getDate(),new Date(post.createdAt).toLocaleString('default', { month: 'short' }));
//     document.querySelector('.blog-details__meta li:first-child a').innerText = `by ${post.authorName}`;
//     document.querySelector('.blog-details__meta li:nth-child(2) a').innerText = `${post.comments.length} Comments`;
//     document.querySelector('.blog-details__title').innerText = post.title;
//     document.querySelector('.blog-details__text-1').innerText = post.content[0];
//     document.querySelector('.blog-details__text-2').innerText = post.content[1];

//     // Populate tags
//     const tagsList = document.querySelector('.blog-details__tags');
//     tagsList.innerHTML = `<span>Tags</span> ${post.tags.map(tag => `<a href="#">${tag}</a>`).join(' ')}`;

//     // Populate comments
//     const commentsContainer = document.querySelector('.comment-one');
//     commentsContainer.innerHTML = post.comments.map(comment => `
//         <div class="comment-one__single">
//             <div class="comment-one__image">
//                 <img src="${comment.image}" alt="Commenter Image">
//             </div>
//             <div class="comment-one__content">
//                 <h3>${comment.name}</h3>
//                 <p>${comment.message}</p>
//                 <a href="#" class="thm-btn comment-one__btn">Reply</a>
//             </div>
//         </div>
//     `).join('');

//     // Update pagination (you may need to fetch previous and next posts separately)
//     const prevPost = post.prevPost;
//     const nextPost = post.nextPost;

//     if (prevPost) {
//         document.querySelector('.blog-details__pagenation-left .blog-details__pagenation-left-img img').src = prevPost.imageUrl;
//         document.querySelector('.blog-details__pagenation-left h4 a').innerText = prevPost.title;
//         document.querySelector('.blog-details__pagenation-left .blog-details__pagenation-left-date').innerText = formatDate(prevPost.date);
//     }

//     if (nextPost) {
//         document.querySelector('.blog-details__pagenation-right .blog-details__pagenation-right-img img').src = nextPost.imageUrl;
//         document.querySelector('.blog-details__pagenation-right h4 a').innerText = nextPost.title;
//         document.querySelector('.blog-details__pagenation-right .blog-details__pagenation-right-date').innerText = formatDate(nextPost.date);
//     }
// }

// function formatDate(dateString) {
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
// }

// Call fetchBlogPost with the ID of the post you want to display
// const postId = localStorage.getItem("PostID");// Implement this function to get the post ID from the URL
// fetchBlogPost(postId);




