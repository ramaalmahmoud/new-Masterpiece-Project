namespace master_piece_project.DTO
{
    public class ChangePasswordDTO
    {
        public int UserId { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }

}
