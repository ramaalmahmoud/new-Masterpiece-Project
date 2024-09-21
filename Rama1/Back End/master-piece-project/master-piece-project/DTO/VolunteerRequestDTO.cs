namespace master_piece_project.DTO
{
    public class VolunteerRequestDTO
    {
        public int? UserId { get; set; }

        public string? VolunteerRole { get; set; }

        public IFormFile? Resume { get; set; }

        public IFormFile? Certificates { get; set; }

        public string? Availability { get; set; }

        public string? WhyVolunteer { get; set; }
    }

}
