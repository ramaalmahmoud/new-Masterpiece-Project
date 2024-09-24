using master_piece_project.DTO;
using master_piece_project.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace master_piece_project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly MyDbContext _db;
        public PaymentsController(MyDbContext db)
        {
            _db = db;
        }
        [HttpPost]
        public IActionResult CreatePayment([FromBody] PaymentRequestDTO request)
        {
            var payment = new Payment
            {
                UserId = request.UserId,
                PaymentType = request.PaymentType,
                Amount = request.Amount,
                PaymentDate = request.PaymentDate,
                PaymentStatus = request.PaymentStatus,
                AppointmentId = request.PaymentType == "Appointment" ? request.AppointmentId : null,
                ProductId = request.PaymentType == "Product" ? request.ProductId : null
            };

            _db.Payments.Add(payment);
            _db.SaveChanges(); // This will block until the payment is saved to the database

            return Ok(payment);
        }


    }
}
