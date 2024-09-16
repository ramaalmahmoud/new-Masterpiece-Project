using System.ComponentModel.DataAnnotations;

namespace master_piece_project.DTO
{
    public class UserDTO
    {
      
        public string? FullName { get; set; }

       

        public string? Email { get; set; }

     
        public string Password { get; set; }

      
        public string RepeatedPassword { get; set; }
    }
}
