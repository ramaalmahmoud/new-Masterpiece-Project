namespace master_piece_project.DTO
{
    public class DoctorRequestDTO
    {
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }

       
        public string? Specialization { get; set; }

        public int? ExperienceYears { get; set; }

        public string? Email { get; set; }
        public string? ClinicAddress { get; set; }


        public decimal? ConsultationFee { get; set; }

        public string? AvailableTimes { get; set; }
        public IFormFile? ProfilePicture { get; set; }

    }
}
