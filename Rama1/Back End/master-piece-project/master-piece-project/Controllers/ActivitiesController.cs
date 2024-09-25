using master_piece_project.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace master_piece_project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActivitiesController : ControllerBase
    {
        private readonly MyDbContext _db;
        public ActivitiesController(MyDbContext db)
        {
            _db = db;
        }
        [HttpGet("GetAllActivities")]
        public async Task<ActionResult<IEnumerable<Activity>>> GetAllActivities()
        {
            var activities = await _db.Activities.ToListAsync();
            if (!activities.Any())
            {
                return NotFound(new { message = "No activities found." });
            }
            return Ok(activities);
        }
        [HttpGet("SearchActivities")]
        public async Task<ActionResult<IEnumerable<Activity>>> SearchActivities(string query)
        {
            var activities = await _db.Activities
                .Where(a => a.Title.Contains(query) )
                .ToListAsync();
            return Ok(activities);
        }
        [HttpGet("FilterActivities")]
        public async Task<ActionResult<IEnumerable<Activity>>> FilterActivities([FromQuery] List<int> categoryIds)
        {
            var activities = await _db.Activities
                 .Where(a => categoryIds.Contains(a.CategoryId))
        .ToListAsync();
            return Ok(activities);
        }



    }
}
