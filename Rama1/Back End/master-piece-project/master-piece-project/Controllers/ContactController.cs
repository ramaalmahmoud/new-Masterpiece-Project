using master_piece_project.DTO;
using master_piece_project.Models;
using master_piece_project.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace master_piece_project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {

        private readonly MyDbContext _dbContext; // استبدل YourDbContext باسم DbContext الخاص بك
        private readonly IEmailService _emailService;

        public ContactController(MyDbContext dbContext, IEmailService emailService)
        {
            _dbContext = dbContext;
            _emailService = emailService;

        }

        [HttpPost("submit")]
        public IActionResult SubmitContact([FromForm] ContactFormDto form)
        {
            // التحقق من صحة البيانات الواردة


            // إنشاء رسالة جديدة وتخزينها في قاعدة البيانات
            var newMessage = new ContactMessage
            {
                Name = form.Name,
                Email = form.Email,
                Phone = form.Phone,
                ContactReason = form.ContactReason,
                Message = form.Message,
                SubmittedAt = DateTime.Now
            };

            _dbContext.ContactMessages.Add(newMessage);
            _dbContext.SaveChanges(); // حفظ التغييرات في قاعدة البيانات

            return Ok(new { message = "Message submitted successfully " });
        }

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<ContactMessageDisplayDto>>> GetAllMessages()
        {
            // Fetch all messages from the ContactMessages table
            var messages = await _dbContext.ContactMessages.ToListAsync();

            // Map messages to the DTO format
            var messageDisplayList = messages.Select(m => new ContactMessageDisplayDto
            {
                Id = m.Id,
                Name = m.Name,
                Email = m.Email,
                Phone = m.Phone,
                ContactReason = m.ContactReason,
                Message = m.Message,
                SubmittedAt = m.SubmittedAt
            }).ToList();

            return Ok(messageDisplayList);
        }
        [HttpGet("get/{id}")]
        public async Task<ActionResult<ContactMessage>> GetMessageDetails(int id)
        {
            var message = await _dbContext.ContactMessages.FindAsync(id);

            if (message == null)
            {
                return NotFound("Message not found.");
            }

            return Ok(message);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteMessage(int id)
        {
            var message = await _dbContext.ContactMessages.FindAsync(id);

            if (message == null)
            {
                return NotFound("Message not found.");
            }

            _dbContext.ContactMessages.Remove(message);
            await _dbContext.SaveChangesAsync();

            return Ok("Message deleted successfully.");
        }
        [HttpPost("respond/{id}")]
        public async Task<IActionResult> RespondByEmail(int id, [FromBody] string responseMessage)
        {
            var message = await _dbContext.ContactMessages.FindAsync(id);

            if (message == null)
            {
                return NotFound("Message not found.");
            }

            try
            {
                await _emailService.SendEmailAsync(
                    message.Email,
                    "Response to Your Contact Message",
                    responseMessage
                );

                return Ok("Response email sent successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error sending email: " + ex.Message);
                return StatusCode(500, "Failed to send email. Please try again later.");
            }
        }

    }
}
