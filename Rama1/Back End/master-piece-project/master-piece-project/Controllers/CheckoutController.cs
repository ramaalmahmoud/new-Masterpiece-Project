using master_piece_project.DTO;
using master_piece_project.Models;
using master_piece_project.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PayPalCheckoutSdk.Orders;
using PayPalCheckoutSdk.Core; // Make sure to include this

using Order = master_piece_project.Models.Order;

namespace master_piece_project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CheckoutController : ControllerBase
    {
        private readonly IPayPalClient _payPalClient;
        private readonly MyDbContext _context;
        public CheckoutController(IPayPalClient payPalClient,MyDbContext context)
        {
            _payPalClient = payPalClient; // Using dependency injection
            _context = context; 
        }

        [HttpPost("create-order")]
       public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            // Create the PayPal order request
            var orderRequest = new OrdersCreateRequest();
            orderRequest.Prefer("return=representation");

            // Create PurchaseUnitRequest
            var purchaseUnitRequest = new PurchaseUnitRequest
            {
                AmountWithBreakdown = new AmountWithBreakdown
                {
                    CurrencyCode = "USD",
                    Value = order.TotalAmount?.ToString() // Ensure this is a string
                }
            };

            // Add PurchaseUnitRequest to the order request
            orderRequest.RequestBody(new OrderRequest
            {
                CheckoutPaymentIntent = "CAPTURE",
                PurchaseUnits = new List<PurchaseUnitRequest> { purchaseUnitRequest },
                ApplicationContext = new ApplicationContext
                {
                    ReturnUrl = "https://yourwebsite.com/return",
                    CancelUrl = "https://yourwebsite.com/cancel"
                }
            });

            // Using the injected PayPalClient to execute the request
            var client = _payPalClient.GetClient();
            var response = await client.Execute(orderRequest);
            
            // Check if the response status is 201 Created
            if (response.StatusCode == System.Net.HttpStatusCode.Created)
            {
                var createdOrder = response.Result<Order>(); // Get the created order from the response

                // Extract the approval URL from the links in the response
                var approvalUrl = createdOrder.Links.FirstOrDefault(link => link.Rel == "approval_url")?.Href;

                if (approvalUrl != null)
                {
                    return Ok(new { ApprovalUrl = approvalUrl });
                }
            }

            return BadRequest("Could not create PayPal order");
        }
    //[HttpGet("return")]
    //    public async Task<IActionResult> CapturePayment(string token, string PayerID)
    //    {
    //        // Step 1: Capture the order after approval
    //        var captureRequest = new OrdersCaptureRequest(token);
    //        captureRequest.RequestBody(new OrderActionRequest());
    //        var response = await _payPalClient.Client.Execute(captureRequest);
    //        var order = response.Result<Order>();

    //        // Step 2: Update the order status in your database
    //        var dbOrder = await _context.Orders.FindAsync(order.Id);
    //        if (dbOrder != null)
    //        {
    //            // Create a Payment record
    //            var payment = new Payment
    //            {
    //                UserId = dbOrder.UserId,
    //                PaymentType = "PayPal",
    //                Amount = dbOrder.TotalAmount,
    //                PaymentDate = DateTime.UtcNow,
    //                PaymentStatus = "Completed", // Update payment status
    //                ProductId = dbOrder.OrderId // Link payment to the order
    //            };

    //            _context.Payments.Add(payment);
    //            dbOrder.OrderStatus = "Completed"; // Update order status
    //            await _context.SaveChangesAsync();
    //        }

    //        return Ok("PaymentSuccess"); // Redirect or show a success page
    //    }

        // Step 3: Handle payment cancellation
        [HttpGet("cancel")]
        public IActionResult Cancel()
        {
            return Ok("PaymentCancelled"); // Redirect or show a cancellation page
        }
    }
}
