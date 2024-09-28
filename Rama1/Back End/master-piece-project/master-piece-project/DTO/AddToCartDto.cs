namespace master_piece_project.DTO
{
    public class AddToCartDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public int? UserId { get; set; } // Optional: If you want to pass UserId directly

    }
}
