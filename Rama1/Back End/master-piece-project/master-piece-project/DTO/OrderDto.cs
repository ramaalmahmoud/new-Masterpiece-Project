namespace master_piece_project.DTO
{
    public class OrderDto
    {
        public List<CartItemDTO> Products { get; set; }
        public decimal? SubTotal { get; set; }
        public string? Shipping { get; set; }
        public decimal? Total { get; set; }
    }
}
