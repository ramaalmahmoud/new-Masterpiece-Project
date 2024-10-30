using master_piece_project.DTO;
using master_piece_project.Models;
using master_piece_project.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace master_piece_project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly PayPalService _payPalService;
        private readonly MyDbContext _db;

        public PaymentsController(PayPalService payPalService, MyDbContext db)
        {
            _payPalService = payPalService;
            _db = db;
        }

        [HttpPost("create-order")]
        [Authorize]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
        {
            if (request == null || request.Amount <= 0)
            {
                return BadRequest("Invalid order details.");
            }

            // Retrieve the current user's ID as an integer
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out int userId))
            {
                return BadRequest("Invalid user ID.");
            }

            // Retrieve the cart items for the current user
            var cartItems = await _db.CartItems
                .Include(ci => ci.Product)
                .Where(ci => ci.Cart.UserId == userId)
                .ToListAsync();

            // Calculate the total amount based on the cart items
            decimal totalAmount = 0; // Initialize totalAmount as a non-nullable decimal
            foreach (var item in cartItems)
            {
                if (item.Product != null)
                {
                    // Use null-coalescing operator to provide a default value for Price if it's null
                    totalAmount += (item.Product.Price ?? 0) * (item.Quantity ?? 0); // Ensure Price and Quantity are not null
                }
            }

            // Create the order
            var order = new Order
            {
                UserId = userId,
                OrderDate = DateTime.UtcNow,
                TotalAmount = totalAmount,
                ShippingAddress = request.ShippingAddress,
                OrderStatus = "Pending"
            };

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            // Create the payment record
            var payment = new Payment
            {
                UserId = userId,
                Amount = totalAmount,
                PaymentDate = DateTime.UtcNow,
                PaymentStatus = "Pending",
                PaymentMethod = request.PaymentMethod,
                OrderId = order.OrderId
            };

            _db.Payments.Add(payment);
            await _db.SaveChangesAsync();

            // Create a PayPal order
            var paypalOrder = await _payPalService.CreateOrder(totalAmount, "USD", "https://your-frontend.com/success", "https://your-frontend.com/cancel");

            return Ok(new
            {
                OrderId = order.OrderId,
                PaymentId = payment.PaymentId,
                PayPalOrderId = paypalOrder.Id,
                Links = paypalOrder.Links
            });
        }

        [HttpPost("capture-order/{orderId}")]
        [Authorize]
        public async Task<IActionResult> CaptureOrder(string orderId)
        {
            if (string.IsNullOrWhiteSpace(orderId))
            {
                return BadRequest("Invalid order ID.");
            }

            var paypalOrder = await _payPalService.CaptureOrder(orderId);
            if (paypalOrder == null)
            {
                return NotFound("Order not found.");
            }

            return Ok(paypalOrder);
        }
    }

    public class CreateOrderRequest
    {
        public decimal Amount { get; set; }
        public string ShippingAddress { get; set; }
        public string PaymentMethod { get; set; }
    }
}
