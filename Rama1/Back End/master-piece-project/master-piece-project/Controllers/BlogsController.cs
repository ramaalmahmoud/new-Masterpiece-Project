using master_piece_project.DTO;
using master_piece_project.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace master_piece_project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogsController : ControllerBase
    {
        private readonly MyDbContext _db;
        public BlogsController(MyDbContext db)
        {
            _db = db;
        }

        // GET: api/BlogPost
        [HttpGet("getAllBlogbost")]
        public IActionResult GetBlogPosts()
        {
            var posts =  _db.BlogPosts
                .Include(p => p.Author)
                .Select(post => new
                {
                    post.PostId,
                    post.Title,
                    post.Content,
                    post.CreatedAt,
                    post.Category,
                    post.Image,
                    Author = post.Author.FullName,
                    post.CommentsCount
                })
                .ToList();

            return Ok(posts);
        }
        [HttpPut("approve/{id}")]
        public IActionResult ApprovePost(int id)
        {
            // Find the blog post by its ID
            var post =  _db.BlogPosts.Find(id);

            if (post == null)
            {
                return NotFound("Post not found.");
            }

            // Update the IsConfirmed field to true
          post.IsConfirmed = true;

            // Save the changes to the database
             _db.SaveChanges();

            return Ok(new { message = "Post approved successfully." });
        }
        [HttpPut("reject/{id}")]
        public IActionResult RejectPost(int id)
        {
            var post = _db.BlogPosts.Find(id);

            if (post == null)
            {
                return NotFound("Post not found.");
            }

            // Update the IsConfirmed field to false
            post.IsConfirmed = false;

            _db.SaveChanges();

            return Ok(new { message = "Post rejected successfully." });
        }


        [HttpPost("createpost")]
        public async Task<IActionResult> CreateBlogPost([FromForm] CreateBlogPostRequest request)
        {
            // Validate request data
            if (request == null ||
               
                string.IsNullOrEmpty(request.Content) ||
             
                string.IsNullOrEmpty(request.Category))
            {
                return BadRequest("Invalid blog post data.");
            }

            // Initialize image path
            string imagePath = null;

            // Check if the uploaded file is not null
            if (request.Image != null && request.Image.Length > 0)
            {
                // Define the path where you want to save the uploaded image
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads/Blogs");
             
                var filePath = Path.Combine(uploadsFolder, request.Image.FileName);

                // Create the folder if it doesn't exist
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Save the uploaded file
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await request.Image.CopyToAsync(fileStream);
                }

                // Set the image path to be saved in the database
                imagePath = filePath; // Save the local file path instead of a URL
            }

            // Create a new blog post object
            var blogPost = new BlogPost
            {
                Title = request.Title,
                Content = request.Content,
                AuthorId = request.AuthorID, // Use the ID of the currently authenticated user
                Image = request.Image.FileName, // Store the file path of the image
                CommentsCount = 0, // Initialize comments count to 0
                CreatedAt = DateTime.UtcNow,
                Category = request.Category // Set the category
            };

            // Add the blog post to the database
            _db.BlogPosts.Add(blogPost);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBlogPost), new { id = blogPost.PostId }, blogPost);
        }

        [HttpGet("getPostByID{id}")]
        public async Task<IActionResult> GetBlogPost(int id)
        {
            var blogPost = await _db.BlogPosts
                .Include(bp => bp.Author) // Assuming you have a navigation property for Author
                .FirstOrDefaultAsync(bp => bp.PostId == id); // Use FirstOrDefaultAsync instead of FindAsync

            if (blogPost == null)
            {
                return NotFound();
            }

            // Create a response model that includes the author's name
            var response = new
            {
                blogPost.PostId,
                blogPost.Title,
                blogPost.Image,
                blogPost.Content,
                AuthorName = blogPost.Author.FullName, // Adjust based on your User model
                                                   // Include other fields you want to return
            };

            return Ok(response);
        }

        [HttpGet("confirmedposts")]
        public IActionResult GetConfirmedPosts()
        {
            var confirmedPosts = _db.BlogPosts
                .Where(post => post.IsConfirmed == true) // Filter by confirmed posts
                .Select(post => new
                {
                    PostId = post.PostId,
                    Title = post.Title,
                    Content = post.Content,
                    CreatedAt = post.CreatedAt,
                    Image = post.Image,
                    Category = post.Category,
                    AuthorName = post.Author.FullName // Assuming 'UserName' is the author's name in the 'Users' table
                })
                .ToList();

            if (confirmedPosts == null)
            {
                return NotFound("No confirmed posts found.");
            }

            return Ok(confirmedPosts); // Return the list of confirmed posts with author names
        }

       
        [HttpGet("sidebarData")]
        public async Task<IActionResult> GetSidebarData()
        {
            // Fetch latest posts
            var latestPosts = await _db.BlogPosts
                .OrderByDescending(bp => bp.CreatedAt)
                .Take(3) // Limit to the latest 3 posts
                .Select(bp => new SidebarPostDto
                {
                    Id = bp.PostId,
                    Title = bp.Title,
                    ImageUrl = bp.Image,
                    CommentCount = bp.Comments.Count() // Count of approved comments
                })
                .ToListAsync();

            

     

            // Create response
            var sidebarResponse = new SidebarResponse
            {
                LatestPosts = latestPosts,
                
            };

            return Ok(sidebarResponse);
        }


    }
}
