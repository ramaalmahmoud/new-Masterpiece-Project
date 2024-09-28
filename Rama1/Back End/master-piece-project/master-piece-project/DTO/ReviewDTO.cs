namespace master_piece_project.DTO
{
    public class ReviewDTO
    {
        public int ProductID { get; set; }  // The ID of the product being reviewed
        public int Rating { get; set; }      // Rating provided by the user
        public string Comment { get; set; }  // The review comment
        public string Email { get; set; }    // Email of the user
        public string Name { get; set; }    // Email of the user
    }
}
