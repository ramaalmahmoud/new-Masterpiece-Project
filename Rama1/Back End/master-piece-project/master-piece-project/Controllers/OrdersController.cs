using master_piece_project.DTO;
using master_piece_project.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
                PaymentType = "products",
                Amount = newOrder.TotalAmount,
                PaymentDate = DateTime.Now,
                PaymentStatus = "Pending"
            };

            _db.Payments.Add(payment);
            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("user/{userId}")]
        public IActionResult GetCartForUser(int userId)
        {
            // Find the user's cart
            var order = _db.Orders
                .Include(c => c.OrderProducts)
                .ThenInclude(i => i.Product)
                .FirstOrDefault(c => c.UserId == userId);

            if (order == null)
                return NotFound(new { Message = "Cart not found for the user." });

            // Map the cart items to the DTO
            var cartDto = new OrderDto
            {
                Products = order.OrderProducts.Select(i => new CartItemDTO
                {
                    ProductName = i.Product.Title,
                    Price = i.Product.Price,
                    Quantity = i.Quantity
                }).ToList(),
                SubTotal = order.TotalAmount,
                Shipping = order.ShippingAddress,
                Total = order.TotalAmount + 200
            };

            return Ok(cartDto);
        }
        [HttpGet("get-cart-total/{userId}")]
        public async Task<IActionResult> GetCartTotal(int userId)
        {
            var cart = await _db.Carts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product) // افتراض أن CartItem يحتوي على علاقة مع جدول المنتجات
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                return NotFound("Cart not found for the user.");
            }

            var totalAmount = cart.CartItems.Sum(item => item.Quantity * item.Product.Price); // احسب الإجمالي بناءً على الكمية والسعر

            return Ok(new { totalAmount });
        }



        // GET: api/orders/{id}
        [HttpGet("GetOrder")]
        public IActionResult GetOrder()
        {
            var order = _db.Orders.ToList();

            if (order == null)
            {
                return NotFound();
            }

            return Ok(order);
        }

        // PUT: api/orders/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateOrderStatus(int id, [FromBody] string newStatus)
        {
            var order = _db.Orders.Find(id);
            if (order == null)
            {
                return NotFound();
            }

            order.OrderStatus = newStatus;
            _db.SaveChanges();

            return NoContent();
        }

        [HttpGet("user/{userId}/orders")]
        public async Task<IActionResult> GetUserOrders(int userId)
        {
            var orders = await _db.Orders
                .Where(o => o.UserId == userId)
                .ToListAsync();

            return Ok(orders);
        }
        [HttpGet("api/orders/{id}")]
        public async Task<IActionResult> GetOrderDetails(int id)
        {
            var order = await _db.Orders
                .Include(o => o.OrderProducts)
                .ThenInclude(op => op.Product) // Assuming OrderProduct has a Product reference
                .FirstOrDefaultAsync(o => o.OrderId == id);

            if (order == null)
            {
                return NotFound("Order not found.");
            }

            var orderDetails = new
            {
                order.OrderId,
                order.UserId,
                CustomerName = order.User != null ? order.User.FullName : "N/A", // Assuming User has a Name property
                order.OrderDate,
                order.TotalAmount,
                order.OrderStatus,
                Items = order.OrderProducts.Select(op => new
                {
                    op.ProductId,
                    op.Quantity,
                    op.Price,
                    ProductName = op.Product.Title // Assuming Product has a Name property
                }).ToList()
            };

            return Ok(orderDetails);
        }


    }
}
