﻿using master_piece_project.DTO;
using master_piece_project.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace master_piece_project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly MyDbContext _context;
        public ReviewsController(MyDbContext db)
        {
            _context = db;
        }
        // POST: api/reviews
        [HttpPost("PostReview")]
        public async Task<IActionResult> PostReview([FromForm] ReviewDTO reviewDto)
        {
            if (reviewDto == null ||
                string.IsNullOrWhiteSpace(reviewDto.Comment) ||
                reviewDto.Rating < 1 || reviewDto.Rating > 5)
            {
                return BadRequest("Invalid review data.");
            }

            // Retrieve UserID by Email
            //var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == reviewDto.Email);

            //if (user == null)
            //{
            //    return NotFound("User not found.");
            //}

            // Check if the user has purchased the product
            // Step 3: Check if the user has purchased this product
            var hasPurchased = await _context.OrderProducts
                .AnyAsync(op => op.Order.UserId == reviewDto.UserId && op.ProductId == reviewDto.ProductID);

           
            if (!hasPurchased)
            {
                return NotFound(new { message = "You must purchase this product before reviewing it" });
            }

            // Create a new Review instance
            var review = new Review
            {
                ProductId = reviewDto.ProductID,
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment,
                UserId = reviewDto.UserId, // Use UserID from the retrieved user
                CreatedAt = DateTime.UtcNow
            };

            // Add the review to the database
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Review Submited successfully." });
        }

        [HttpGet("Reviews/{postId}")]
        public IActionResult GetReviews(int postId)
        {
            var reviews = _context.Reviews
                .Where(review => review.ProductId == postId)
                .Select(review => new
                {
                    ReviewId = review.ReviewId,
                    Rating = review.Rating,
                    Comment = review.Comment,
                    CreatedAt = review.CreatedAt,
                    UserName = review.User.FullName, // Assuming User has a FullName property
                    UserPicture = review.User.ProfilePicture // Assuming User has a ProfilePictureUrl property
                })
                .ToList();

            if (reviews == null || !reviews.Any())
            {
                return NotFound("No reviews found for this post.");
            }

            return Ok(reviews);
        }

    }
}
