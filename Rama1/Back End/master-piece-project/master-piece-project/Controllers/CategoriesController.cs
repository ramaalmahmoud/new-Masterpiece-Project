using master_piece_project.DTO;
using master_piece_project.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static master_piece_project.Controllers.ActivitiesController;

namespace master_piece_project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly MyDbContext _db;
        public CategoriesController(MyDbContext db)
        {
            _db = db;
        }
        // GET: api/categories
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
        {
            var categories = await _db.ProductCategories
                .Select(c => new CategoryDto
                {
                    CategoryID = c.CategoryId,
                    CategoryName = c.CategoryName,
                })
                .ToListAsync();

            return Ok(categories);
        }
        // POST: api/products/filterByCategories
        [HttpPost("filterByCategories")]
        public async Task<ActionResult<IEnumerable<Product>>> FilterProductsByCategories([FromQuery] List<int> categoryIds)
        {
            // Validate the category IDs (optional)
            if (categoryIds == null || !categoryIds.Any())
            {
                return BadRequest("No category IDs provided.");
            }

            var products = await _db.Products
                .Where(p => categoryIds.Contains(p.CategoryId))
                .Include(p => p.Reviews) // Include reviews if you need to show ratings
                .ToListAsync();

            return Ok(products);
        }
        // Add a new Category
        [HttpPost("add-category")]
        public IActionResult AddCategory([FromForm] PrpductCategoryDto categoryDto)
        {
            var category = new ProductCategory
            {
                CategoryName = categoryDto.CategoryName
            };

            _db.ProductCategories.Add(category);
            _db.SaveChanges();

            return Ok(new { Message = "Category added successfully" });
        }
        // Edit an existing Category
        [HttpPut("edit-category/{id}")]
        public IActionResult EditCategory(int id, [FromBody] PrpductCategoryDto categoryDto)
        {
            var category = _db.ProductCategories.Find(id);
            if (category == null)
            {
                return NotFound(new { Message = "Category not found" });
            }

            category.CategoryName = categoryDto.CategoryName;

            _db.ProductCategories.Update(category);
            _db.SaveChanges();

            return Ok(new { Message = "Category updated successfully" });
        }

        // Delete a Category
        [HttpDelete("delete-category/{id}")]
        public IActionResult DeleteCategory(int id)
        {
            var category = _db.ProductCategories.Find(id);
            if (category == null)
            {
                return NotFound(new { Message = "Category not found" });
            }

            _db.ProductCategories.Remove(category);
            _db.SaveChanges();

            return Ok(new { Message = "Category deleted successfully" });
        }
        // GET: api/categories/{id}
        [HttpGet("GetCategoryById/{id}")]
        public async Task<ActionResult<CategoryDto>> GetCategoryById(int id)
        {
            var category = await _db.ProductCategories
                .Where(c => c.CategoryId == id)
                .Select(c => new CategoryDto
                {
                    CategoryID = c.CategoryId,
                    CategoryName = c.CategoryName
                })
                .FirstOrDefaultAsync();

            if (category == null)
            {
                return NotFound(); // Return 404 if category not found
            }

            return Ok(category); // Return the category details
        }

    }

}

