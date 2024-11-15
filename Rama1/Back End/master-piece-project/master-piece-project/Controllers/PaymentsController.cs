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

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out int userId))
            {
                return BadRequest("Invalid user ID.");
            }

            // Retrieve cart items for the user
            var cartItems = await _db.CartItems
                .Include(ci => ci.Product)
                .Where(ci => ci.Cart.UserId == userId)
                .ToListAsync();

            if (!cartItems.Any())
            {
                return BadRequest("Cart is empty.");
            }

            // Calculate total amount and create the order
            decimal totalAmount = cartItems.Sum(item => (item.Product.Price ?? 0) * (item.Quantity ?? 0));

            // Ensure we have a valid total amount
            if (totalAmount <= 0)
            {
                return BadRequest("Total amount must be greater than zero.");
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
            await _db.SaveChangesAsync(); // Save to generate OrderId

            // Create OrderProduct entries and remove from cart
            foreach (var item in cartItems)
            {
                var orderProduct = new OrderProduct
                {
                    OrderId = order.OrderId,
                    ProductId = item.Product.ProductId,
                    Quantity = item.Quantity ?? 0
                };

                _db.OrderProducts.Add(orderProduct);
            }

            // Remove items from the cart after creating order products
            _db.CartItems.RemoveRange(cartItems);
            await _db.SaveChangesAsync(); // Commit changes to remove items from cart

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
