using master_piece_project.DTO;
using master_piece_project.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace master_piece_project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {

        private readonly MyDbContext _dbContext; // استبدل YourDbContext باسم DbContext الخاص بك

        public ContactController(MyDbContext dbContext)
        {
            _dbContext = dbContext;
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

            return Ok();
        }
    }
}
