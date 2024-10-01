using master_piece_project.DTO;
using master_piece_project.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace master_piece_project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly MyDbContext _db;

        public OrdersController(MyDbContext context)
        {
            _db = context;
        }
        [HttpPost("createOrderAPI")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDTO newOrder)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Create a new order
            var order = new Order
            {
                UserId = newOrder.UserId,
                TotalAmount = newOrder.TotalAmount,
                OrderStatus = newOrder.OrderStatus,
                OrderDate = newOrder.OrderDate,
                ShippingAddress = newOrder.ShippingAddress
            };

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            // Add products to the order
            foreach (var productId in newOrder.Products)
            {
                // Check if product exists
                var product = await _db.Products.FindAsync(productId);
                if (product == null)
                {
                    return BadRequest($"Product with ID {productId} not found.");
                }

                var orderProduct = new OrderProduct
                {
                    OrderId = order.OrderId,
                    ProductId = productId
                };

                _db.OrderProducts.Add(orderProduct);
            }

            // Save changes for the products
            await _db.SaveChangesAsync();

            // Create a payment
            var payment = new Payment
            {
                OrderId = order.OrderId,
                PaymentType = newOrder.PaymentMethod,
                Amount = newOrder.TotalAmount,
                PaymentDate = DateTime.Now,
                PaymentStatus = "Pending"
            };

            _db.Payments.Add(payment);
            await _db.SaveChangesAsync();

            return Ok();
        }
    }
}
