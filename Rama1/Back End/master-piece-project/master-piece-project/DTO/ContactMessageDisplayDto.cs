namespace master_piece_project.DTO
{
    public class ContactMessageDisplayDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string ContactReason { get; set; }
        public string Message { get; set; }
        public DateTime? SubmittedAt { get; set; }

    }
}
