using System.ComponentModel.DataAnnotations;

namespace master_piece_project.DTO
{
    public class ContactFormDto
    {
      
            [Required(ErrorMessage = "Name is required.")]
            public string Name { get; set; }

            [Required(ErrorMessage = "Email is required.")]
            [EmailAddress(ErrorMessage = "Invalid email format.")]
            public string Email { get; set; }

            [Required(ErrorMessage = "Phone is required.")]
            public string Phone { get; set; }

            [Required(ErrorMessage = "Contact reason is required.")]
            public string ContactReason { get; set; }

            [Required(ErrorMessage = "Message is required.")]
            public string Message { get; set; }
        

    }
}
