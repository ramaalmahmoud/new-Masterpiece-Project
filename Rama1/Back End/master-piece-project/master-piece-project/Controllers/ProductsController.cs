using master_piece_project.DTO;
using master_piece_project.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace master_piece_project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly MyDbContext _db;
        public ProductsController(MyDbContext db)
        {
            _db = db;
        }
        // GET: api/products/all
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<ProductDisplayDto>>> GetAllProducts()
        {
            // Fetch all products and their average star ratings
            var products = await _db.Products
                .Include(p => p.Category) // Include category if needed
                .ToListAsync();

            var productDisplayList = products.Select(p => new ProductDisplayDto
            {
                ProductID = p.ProductId,
                Title = p.Title,
                Price = p.Price,
                Image = p.Image,
                categoryID = p.CategoryId,
                Stars = GetAverageRating(p.ProductId) // Method to calculate the average rating
            }).ToList();

            return Ok(productDisplayList);
        }

        private double? GetAverageRating(int productId)
        {
            // Get the reviews for the specified product ID
            var reviews = _db.Reviews
                .Where(r => r.ProductId == productId)
                .ToList();

            // Calculate the average rating
            if (reviews.Count == 0)
            {
                return 0; // No reviews, return 0 or any default value
            }

            double? averageRating = reviews.Average(r => r.Rating);
            return averageRating;
        }
        [HttpGet("sort")]
        public async Task<ActionResult> SortProducts(int sortBy)
        {
            IQueryable<Product> products = _db.Products.Include(p => p.Reviews);

            products = sortBy switch
            {
                1 => products.OrderBy(p => p.Price), // Sort by Price: Low to High
                2 => products.OrderByDescending(p => p.Price), // Sort by Price: High to Low
                _ => products.OrderByDescending(p => p.Reviews.Average(r => r.Rating)), // Default Sort by Popularity
            };

            var result = await products
                .Select(p => new ProductDisplayDto
                {
                    ProductID = p.ProductId,
                    Title = p.Title,
                    Image = p.Image,
                    Price = p.Price,
                    Stars = p.Reviews.Any() ? p.Reviews.Average(r => r.Rating) : 0 // Calculate average rating
                })
                .ToListAsync();

            // Return JsonResult with specific settings
            var jsonOptions = new JsonSerializerOptions
            {
                ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve,
                // Add other options here if needed
            };

            return new JsonResult(result, jsonOptions);
        }

        // GET: api/products/search
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Product>>> SearchProducts(string query)
        {
            var products = await _db.Products
                .Where(p => p.Title.Contains(query) || p.Description.Contains(query))
                .ToListAsync();

            return products;
        }
        // GET: api/products/filter
        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<Product>>> FilterProducts(decimal minPrice, decimal maxPrice)
        {
            var products = await _db.Products
                .Where(p => p.Price >= minPrice && p.Price <= maxPrice)
                .ToListAsync();

            return products;
        }


        // Get product by ID
        [HttpGet("GetProductById/{id}")]
        public IActionResult GetProductById(int id)
        {
            var product = _db.Products.FirstOrDefault(p => p.ProductId == id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }


        [HttpPost]
        public IActionResult AddProduct([FromForm] addProductDto productDto)
        {
            var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            if (productDto.Image != null && productDto.Image.Length > 0)
            {
                if (!Directory.Exists(uploadsFolderPath))
                {
                    Directory.CreateDirectory(uploadsFolderPath);
                }
                var filePath = Path.Combine(uploadsFolderPath, productDto.Image.FileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    productDto.Image.CopyTo(stream);
                }
            }

            var product = new Product
            {
                Title = productDto.Title,
                Description = productDto.Description,
                Price = productDto.Price,
                Stock = productDto.Stock,
                CategoryId = productDto.CategoryId,
                Image = productDto.Image.FileName
            };

            _db.Products.Add(product);
            _db.SaveChanges();

            return Ok(new { message = "Product added successfully!" });
        }
    }
}

