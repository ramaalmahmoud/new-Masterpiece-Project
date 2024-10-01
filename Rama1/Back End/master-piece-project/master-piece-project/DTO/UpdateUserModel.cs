namespace master_piece_project.DTO
{
    public class UpdateUserModel
    {
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public IFormFile ProfilePicture { get; set; } // For handling profile picture uploads

    }
}
