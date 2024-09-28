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

        [HttpGet("GetCategories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _db.ActivityCategories.ToListAsync();
            return Ok(categories);
        }
        [HttpGet("GetActivityWithDetails/{id}")]
        
        public async Task<ActionResult<ActivityWithMaterialsDto>> GetActivityWithMaterials(int id)
        {
            var activity = await _db.Activities
    .Include(a => a.Materials) // Include the related materials
    .Include(a => a.Instructions) // Include instructions
    .FirstOrDefaultAsync(a => a.ActivityId == id);


            if (activity == null)
            {
                return NotFound();
            }

            var activityDto = new ActivityWithMaterialsDto
            {
                Title = activity.Title,
                Image = activity.Image,
                Materials = activity.Materials?.Select(m => m.Name).ToList() ?? new List<string>(), // Ensure it returns a list, even if null
                Instructions = activity.Instructions?.Select(i => new InstructionDto
                {
                    StepNumber = i.StepNumber,
                    InstructionText = i.InstructionText,
                    ImageUrl = i.ImageUrl
                }).ToList() ?? new List<InstructionDto>() // Ensure this also returns a list
            };


            return Ok(activityDto);
        }

        public class ActivityWithMaterialsDto
        {
            public string Title { get; set; }
            public string Image { get; set; }
            public List<string> Materials { get; set; }
            public List<InstructionDto> Instructions { get; set; }
        }

        public class InstructionDto
        {
            public int StepNumber { get; set; }
            public string InstructionText { get; set; }
            public string ImageUrl { get; set; }
        }


    }
}
