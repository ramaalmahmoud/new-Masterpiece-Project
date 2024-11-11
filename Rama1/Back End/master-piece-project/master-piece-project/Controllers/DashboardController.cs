using master_piece_project.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace master_piece_project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly MyDbContext _context;
        public DashboardController(MyDbContext db)
        {
            _context = db;
        }

        [HttpGet("stats")]
        public IActionResult GetDashboardStats()
        {
            var stats = new
            {
                TotalUsers = _context.Users.Count(),
                TotalActivities = _context.Activities.Count(), // Get the total number of activities
                TotalSales = _context.Orders.Sum(o => o.TotalAmount),
                TotalOrders = _context.Orders.Count()
            };
            return Ok(stats);
        }

        [HttpGet("recent-customers")]
        public IActionResult GetRecentCustomers()
        {
            var customers =  _context.Users
                .OrderByDescending(u => u.UserId)  // Orders users by their creation date in descending order
                .Take(6)  // Limits the result to the 6 most recent users
                .Select(u => new
                {
                    u.UserId,
                    u.FullName,
                    u.Email,
                    u.UserRole,
                    u.Status,  // Assuming the block status is stored in the 'Status' field
                    BlockStatus = u.Status == "Blocked" ? "Blocked" : "Active" // Customizing block status message
                })
                .ToList();  // Executes the query asynchronously

            return Ok(customers);  // Returns the result as a response
        }



        [HttpGet("transaction-history")]
        public IActionResult GetTransactionHistory()
        {
            var transactions = _context.Payments
                .OrderByDescending(p => p.PaymentDate)
                .Take(10)
                .Select(p => new { p.PaymentId, p.Amount, p.PaymentStatus, p.PaymentDate })
                .ToList();
            return Ok(transactions);
        }
    }
}