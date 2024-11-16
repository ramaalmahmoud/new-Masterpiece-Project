using master_piece_project.DTO;
using master_piece_project.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace master_piece_project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly MyDbContext _db;
        public CommentsController(MyDbContext db)
        {
            _db = db;
        }
        // GET: api/Comment
        [HttpGet("GetComments")]
        public IActionResult GetComments()
        {
            var comments =  _db.Comments
                .Include(c => c.Post)
                .Include(c => c.User)
                .Select(comment => new
                {
                    comment.CommentId,
                    comment.CommentText,
                    comment.CreatedAt,
                    PostTitle = comment.Post.Title,
                    UserName = comment.User.FullName,
                    comment.IsApproved

                })
                .ToList();

            return Ok(comments);
        }
        [HttpPut("approve/{id}")]
        public IActionResult ApproveComment(int id)
        {
            // Find the blog post by its ID
            var post = _db.Comments.Find(id);

            if (post == null)
            {
                return NotFound("Post not found.");
            }

            // Update the IsConfirmed field to true
            post.IsApproved = true;

            // Save the changes to the database
            _db.SaveChanges();

            return Ok(new { message = "Post approved successfully.", isApproved = post.IsApproved });
        }
        [HttpPut("reject/{id}")]
        public IActionResult RejectComment(int id)
        {
            var post = _db.Comments.Find(id);

            if (post == null)
            {
                return NotFound("Post not found.");
            }

            // Update the IsConfirmed field to false
            post.IsApproved = false;

            _db.SaveChanges();

            return Ok(new { message = "Post rejected successfully.", isApproved = post.IsApproved });
        }

        [HttpPost("submitComment")]
        public async Task<IActionResult> SubmitComment([FromBody] SubmitCommentDto commentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Find the blog post by PostId
            var blogPost = await _db.BlogPosts.FindAsync(commentDto.PostId);
            if (blogPost == null)
            {
                return NotFound(new { message = "Blog post not found." });
            }

            // Check if a user with the given email already exists
            var existingUser = await _db.Users.FirstOrDefaultAsync(u => u.Email == commentDto.Email);

            User user;
            if (existingUser != null)
            {
                // Use existing user
                user = existingUser;
            }
            else
            {
                // Create a new User object if the email does not exist
                user = new User
                {
                    FullName = commentDto.Name,
                    Email = commentDto.Email
                };

                // Add the new user to the database
                _db.Users.Add(user);
                await _db.SaveChangesAsync(); // Save to get the user ID
            }

            // Create a new Comment object
            var comment = new Comment
            {
                PostId = commentDto.PostId,
                CommentText = commentDto.CommentText,
                CreatedAt = DateTime.Now,
                UserId = user.UserId // Assuming UserId is the primary key
            };

            // Add the comment to the database
            _db.Comments.Add(comment);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Comment submitted successfully and awaiting approval." });
        }
        [HttpGet("comments/{postId}")]
        public IActionResult GetApprovedComments(int postId)
        {
            // Retrieve comments that are approved for the specified post
            var approvedComments = _db.Comments
                .Where(c => c.PostId == postId && (c.IsApproved == true || c.IsApproved == null)) // Fix for IsApproved translation
                .Select(c => new
                {
                    c.CommentId,
                    c.CommentText,
                    c.CreatedAt,
                    UserName = c.User.FullName, // Assuming User contains FullName property
                    UserImage = c.User.ProfilePicture // Assuming User has a profile image
                })
                .ToList();

            if (!approvedComments.Any())
            {
                return NotFound(new { message = "No comments found." });
            }

            return Ok(approvedComments);
        }


    }
}
