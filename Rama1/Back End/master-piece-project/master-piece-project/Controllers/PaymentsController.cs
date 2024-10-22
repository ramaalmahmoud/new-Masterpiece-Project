using master_piece_project.DTO;
using master_piece_project.Models;
using master_piece_project.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

            // يمكنك استبدال هذه الروابط بروابط الواجهة الأمامية الخاصة بك
            string returnUrl = "https://your-frontend.com/success";
            string cancelUrl = "https://your-frontend.com/cancel";

            var order = await _payPalService.CreateOrder(request.Amount, "USD", returnUrl, cancelUrl);
            return Ok(order);
        }

        [HttpPost("capture-order/{orderId}")]
        [Authorize]
        public async Task<IActionResult> CaptureOrder(string orderId)
        {
            if (string.IsNullOrWhiteSpace(orderId))
            {
                return BadRequest("Invalid order ID.");
            }

            var order = await _payPalService.CaptureOrder(orderId);
            return Ok(order);
        }
    }

    public class CreateOrderRequest
    {
        public decimal Amount { get; set; }
    }
}
