using master_piece_project.Models;
using static master_piece_project.Controllers.ActivitiesController;

namespace master_piece_project.DTO
{
    public class AddActivityDto
    {
        public string Title { get; set; }
        public IFormFile? Image { get; set; }
        public int CategoryId { get; set; }
        public string Duration { get; set; }
        public string Suggestions { get; set; }
        public List<addInstructionDto> Instructions { get; set; }
        public List<MaterialDto> Materials { get; set; }

    }
}
