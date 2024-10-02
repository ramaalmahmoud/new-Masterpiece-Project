using master_piece_project.DTO;
using master_piece_project.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static master_piece_project.Controllers.ActivitiesController;

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
        // Add a new Activity
        [HttpPost("add-activity")]
        public IActionResult AddActivity([FromForm] AddActivityDto activityDto)
        {
            var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            if (activityDto.Image != null && activityDto.Image.Length > 0)
            {
                if (!Directory.Exists(uploadsFolderPath))
                {
                    Directory.CreateDirectory(uploadsFolderPath);
                }
                var filePath = Path.Combine(uploadsFolderPath, activityDto.Image.FileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    activityDto.Image.CopyTo(stream);
                }
            }

            var activity = new Activity
            {
                Title = activityDto.Title,
                Image = activityDto.Image.FileName,
                CategoryId = activityDto.CategoryId,
                Duration = activityDto.Duration,
                Suggestions = activityDto.Suggestions
            };

            _db.Activities.Add(activity);
             _db.SaveChanges();
          
            //Add Matirials
            foreach (var matirialDto in activityDto.Materials)
            {
                var material = new Material
                {
                    ActivityId = activity.ActivityId,
                    Name = matirialDto.Name,

                };
                _db.Materials.Add(material);

            }

            // Add Instructions to the Activity
            foreach (var instructionDto in activityDto.Instructions)
            {
                if (instructionDto.ImageUrl != null && instructionDto.ImageUrl.Length > 0)
                {
                    if (!Directory.Exists(uploadsFolderPath))
                    {
                        Directory.CreateDirectory(uploadsFolderPath);
                    }
                    var filePath = Path.Combine(uploadsFolderPath, instructionDto.ImageUrl.FileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        instructionDto.ImageUrl.CopyTo(stream);
                    }
                }
                var instruction = new Instruction
                {
                    ActivityId = activity.ActivityId,
                    StepNumber = instructionDto.StepNumber,
                    InstructionText = instructionDto.InstructionText,
                    ImageUrl = instructionDto.ImageUrl.FileName
                };

                _db.Instructions.Add(instruction);
            }

             _db.SaveChanges();

            return Ok(new { Message = "Activity added successfully" });
        }


        // Add a new Category
        [HttpPost("add-category")]
        public IActionResult AddCategory([FromForm] ActivityCategoryDto categoryDto)
        {
            var category = new ActivityCategory
            {
                CategoryName = categoryDto.CategoryName
            };

            _db.ActivityCategories.Add(category);
             _db.SaveChanges();

            return Ok(new { Message = "Category added successfully" });
        }
        [HttpGet("get-activityCategory")]
        public IActionResult getactivityCategory()
        {
            var activitiesCat =  _db.ActivityCategories.ToList();
            if (!activitiesCat.Any())
            {
                return NotFound(new { message = "No activities found." });
            }
            return Ok(activitiesCat);
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
        public class ActivityCategoryDto
        {
            public string CategoryName { get; set; }
        }


        }
    }
