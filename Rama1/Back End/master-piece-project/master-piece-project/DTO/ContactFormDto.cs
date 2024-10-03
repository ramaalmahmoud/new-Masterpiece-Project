using System.ComponentModel.DataAnnotations;

namespace master_piece_project.DTO
{
    public class ContactFormDto
    {
      
            public string Name { get; set; }

            public string Email { get; set; }

        
            public string Phone { get; set; }

        public string ContactReason { get; set; }

        public string Message { get; set; }
        

    }
}
