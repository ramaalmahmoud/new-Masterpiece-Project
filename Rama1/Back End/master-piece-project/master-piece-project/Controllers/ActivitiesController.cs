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
        // GET: api/activities
        [HttpGet("get-activities")]
        public IActionResult GetActivities()
        {
            var activities = _db.Activities
                .Select(a => new
                {
                    a.ActivityId,
                    a.Title,
                    a.Image,
                    CategoryName = a.Category.CategoryName,
                    a.Duration,
                    a.Suggestions,
                    Materials = a.Materials.Select(m => new { m.Name }).ToList(),
                    Instructions = a.Instructions.Select(i => new { i.StepNumber, i.InstructionText, i.ImageUrl }).ToList()
                })
                .ToList();

            return Ok(activities);
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

        //[HttpGet("GetCategories")]
        //public IActionResult GetCategories()
        //{
        //    var categories =  _db.ActivityCategories.ToList();
        //    return Ok(categories);
        //}
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
                Duration = activity.Duration,
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
            var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads/Activity");
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
            var activitiesCat = _db.ActivityCategories
                .Select(c => new
                {
                    c.CategoryId,   // Assuming CategoryId is the correct field name
                    CategoryName = c.CategoryName // Adjust the property name here to match what's in your database
                })
                .ToList();

            if (!activitiesCat.Any())
            {
                return NotFound(new { message = "No activities found." });
            }

            return Ok(activitiesCat);
        }
        [HttpGet("user/{userId}/activities")]
        public async Task<IActionResult> GetUserActivities(int userId)
        {
            var userActivities = await _db.SavedPrintedActivities
                .Where(spa => spa.UserId == userId)
                .Select(spa => new
                {
                    ActivityId = spa.ActivityId,
                    ActivityTitle = spa.Activity != null ? spa.Activity.Title : null,
                    ActionType = spa.ActionType,
                    ActionDate = spa.ActionDate,
                    Steps = spa.Activity != null ? spa.Activity.Instructions : null, // Assuming Activity contains 'Steps'
                    Materials = spa.Activity != null ? spa.Activity.Materials : null // Assuming Activity contains 'Materials'
                })
                .ToListAsync();

            return Ok(userActivities);
        }

        // In your ActivitiesController (or create a separate SavedActivitiesController if preferred)

        [HttpPost("saveActivity")]
        public IActionResult SaveActivity([FromBody] SavedActivityDTO savedActivity)
        {
            var existingAction = _db.SavedPrintedActivities
                .FirstOrDefault(a => a.UserId == savedActivity.UserId && a.ActivityId == savedActivity.ActivityId);

            if (existingAction == null)
            {
                // Save the activity if it's not already saved
                var newAction = new SavedPrintedActivity
                {
                    UserId = savedActivity.UserId,
                    ActivityId = savedActivity.ActivityId,
                    ActionType = "Save",
                    ActionDate = DateTime.Now
                };
                _db.SavedPrintedActivities.Add(newAction);
                _db.SaveChanges();
                return Ok(new { message = "Activity saved.", status = "saved" });
            }
            else
            {
                // Unsave the activity if it is already saved
                _db.SavedPrintedActivities.Remove(existingAction);
                _db.SaveChanges();
                return Ok(new { message = "Activity unsaved.", status = "unsaved" });
            }
        }
        [HttpGet("checkActivityStatus/{userId}/{activityId}")]
        public IActionResult CheckActivityStatus(int userId, int activityId)
        {
            // Check if the activity is saved by the user
            var isSaved = _db.SavedPrintedActivities
                .Any(a => a.UserId == userId && a.ActivityId == activityId);

            return Ok(new { isSaved = isSaved });
        }

        [HttpPut("update-activity/{id}")]
        public IActionResult UpdateActivity(int id, [FromForm] AddActivityDto activityDto)
        {
            var activity = _db.Activities.Include(a => a.Materials).Include(a => a.Instructions).FirstOrDefault(a => a.ActivityId == id);
            if (activity == null)
            {
                return NotFound(new { Message = "Activity not found." });
            }

            var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads/Activity");

            // Update Title and Duration if provided
            activity.Title = activityDto.Title ?? activity.Title;
            activity.Duration = activityDto.Duration ?? activity.Duration;
            activity.Suggestions = activityDto.Suggestions ?? activity.Suggestions;
            activity.CategoryId = activityDto.CategoryId != 0 ? activityDto.CategoryId : activity.CategoryId;

            // Update Image if a new file is provided
            if (activityDto.Image != null && activityDto.Image.Length > 0)
            {
                var filePath = Path.Combine(uploadsFolderPath, activityDto.Image.FileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    activityDto.Image.CopyTo(stream);
                }
                activity.Image = activityDto.Image.FileName;
            }

            // Remove existing materials and add updated ones
            _db.Materials.RemoveRange(activity.Materials);
            foreach (var materialDto in activityDto.Materials)
            {
                var material = new Material
                {
                    ActivityId = activity.ActivityId,
                    Name = materialDto.Name
                };
                _db.Materials.Add(material);
            }

            // Remove existing instructions and add updated ones
            _db.Instructions.RemoveRange(activity.Instructions);
            foreach (var instructionDto in activityDto.Instructions)
            {
                var instruction = new Instruction
                {
                    ActivityId = activity.ActivityId,
                    StepNumber = instructionDto.StepNumber,
                    InstructionText = instructionDto.InstructionText
                };

                // Update instruction image if provided
                if (instructionDto.ImageUrl != null && instructionDto.ImageUrl.Length > 0)
                {
                    var instructionFilePath = Path.Combine(uploadsFolderPath, instructionDto.ImageUrl.FileName);
                    using (var stream = new FileStream(instructionFilePath, FileMode.Create))
                    {
                        instructionDto.ImageUrl.CopyTo(stream);
                    }
                    instruction.ImageUrl = instructionDto.ImageUrl.FileName;
                }

                _db.Instructions.Add(instruction);
            }

            _db.SaveChanges();

            return Ok(new { Message = "Activity updated successfully" });
        }
        [HttpDelete("DeleteActivity/{id}")]
        public IActionResult DeleteActivity(int id)
        {
            // Retrieve the activity with its related materials
            var activity = _db.Activities.Include(a => a.Materials).FirstOrDefault(a => a.ActivityId == id);

            if (activity == null)
            {
                return NotFound(); // Return 404 if the activity is not found
            }

            // Delete all related materials
            _db.Materials.RemoveRange(activity.Materials);

            // Now delete the activity
            _db.Activities.Remove(activity);

            // Save the changes to the database
            _db.SaveChanges();

            return NoContent(); // Return 204 No Content to indicate successful deletion
        }


        public class ActivityWithMaterialsDto
        {
            public string Title { get; set; }
            public string Image { get; set; }
            public string? Duration { get; set; }

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
