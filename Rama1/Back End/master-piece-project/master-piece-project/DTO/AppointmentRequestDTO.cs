namespace master_piece_project.DTO
{
    public class AppointmentRequestDTO
    {
      public int UserId {  get; set; }
            public string FirstName { get; set; }            // First Name of the user
            public string LastName { get; set; }             // Last Name of the user
            public string Email { get; set; }                // Email address
            public string Phone { get; set; }                // Phone number
            public int ProgramId { get; set; }               // Program selected (General Therapy, Cognitive Behavioral Therapy, etc.)
            public int DoctorId { get; set; }                // Selected doctor's ID
            public DateTime AppointmentDate { get; set; }    // The date for the appointment
            public string SessionType { get; set; }          // Session type (Online, In-person)
            public string Message { get; set; }              // Optional message from the user
        

    }
}
