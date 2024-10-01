using master_piece_project.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace master_piece_project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly MyDbContext _context;

        public ChatController(MyDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public  IActionResult GetMessages()
        {
            var messages =  _context.ParentChats.OrderBy(m => m.SentAt).ToList();
            return Ok(messages);
        }

    }
}
