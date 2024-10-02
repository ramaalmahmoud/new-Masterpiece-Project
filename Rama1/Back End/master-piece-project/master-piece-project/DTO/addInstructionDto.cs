namespace master_piece_project.DTO
{
    public class addInstructionDto
    {
        public int StepNumber { get; set; }
        public string InstructionText { get; set; }
        public IFormFile? ImageUrl { get; set; }
    }
}
