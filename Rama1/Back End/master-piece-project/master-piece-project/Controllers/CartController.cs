using master_piece_project.DTO;
using master_piece_project.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace master_piece_project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly MyDbContext _context;

        public CartController(MyDbContext context)
        {
            _context = context;
        }
        // 1. Add to Cart
        [HttpPost("AddToCart")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartDto dto)
        {
            if (dto.ProductId <= 0 || dto.Quantity <= 0)
            {
                return BadRequest("ProductId and Quantity must be greater than 0.");
            }

            // Find or create the cart for the user
            var cart = await _context.Carts
                .FirstOrDefaultAsync(c => c.UserId == dto.UserId);

            if (cart == null)
            {
                cart = new Cart
                {
                    UserId = dto.UserId, // Link UserId from the DTO
                    CreatedAt = DateTime.UtcNow
                };
                await _context.Carts.AddAsync(cart);
                await _context.SaveChangesAsync();
            }

            // Check if the product is already in the cart
            var existingItem = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.CartId == cart.CartId && ci.ProductId == dto.ProductId);

            if (existingItem != null)
            {
                // Update quantity if the product already exists in the cart
                existingItem.Quantity += dto.Quantity; // Add the provided quantity
                _context.CartItems.Update(existingItem);
            }
            else
            {
                // Add the new item to the cart
                var cartItem = new CartItem
                {
                    CartId = cart.CartId, // Associate with the cart
                    ProductId = dto.ProductId,
                    Quantity = dto.Quantity
                };
                await _context.CartItems.AddAsync(cartItem);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cart item added successfully." });
        }
        // CartController.cs
        [HttpGet("GetCartByUserId/{userId}")]
        public async Task<IActionResult> GetCartByUserId(int userId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
                return NotFound("Cart not found.");

            // Map the Cart to CartDTO
            var cartDTO = new CartDTO
            {
                CartItems = cart.CartItems.Select(ci => new CartItemDTO
                {
                    CartItemId=ci.CartItemId,


                    ProductId = ci.ProductId ?? 0,
                    ProductName = ci.Product?.Title ?? "Unknown Product",  // Ensure 'Name' exists in Product class
                    ProductImage= ci.Product?.Image ?? "Unkown Image",
                    Price = ci.Product?.Price ?? 0,

                    Quantity = ci.Quantity ?? 0
                }).ToList(),
                Subtotal = cart.CartItems.Sum(ci => (ci.Quantity ?? 0) * (ci.Product?.Price ?? 0)),
                ShippingCost = 0 // Assuming shipping cost is 0 for now
            };

            return Ok(cartDTO);
        }
        [HttpPut("UpdateCartItem/{cartItemId}")]
        public async Task<IActionResult> UpdateCartItem(int cartItemId, [FromBody] int quantity)
        {
            // Find the cart item
            var cartItem = await _context.CartItems
                .Include(ci => ci.Product) // Include the product to recalculate total
                .FirstOrDefaultAsync(ci => ci.CartItemId == cartItemId);

            if (cartItem == null)
                return NotFound("Cart item not found.");

            // Update the quantity
            cartItem.Quantity = quantity;

            // Save changes to the database
            _context.CartItems.Update(cartItem);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cart item updated successfully." });
        }
        [HttpDelete("DeleteCartItem/{cartItemId}")]
        public async Task<IActionResult> DeleteCartItem(int cartItemId)
        {
            // Find the cart item
            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.CartItemId == cartItemId);

            if (cartItem == null)
                return NotFound("Cart item not found.");

            // Remove the cart item
            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cart item deleted successfully." });
        }



    }
}
