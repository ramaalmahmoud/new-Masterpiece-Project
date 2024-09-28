namespace master_piece_project.DTO
{
    public class CartDTO
    {
        public List<CartItemDTO> CartItems { get; set; } = new List<CartItemDTO>(); // List of all items in the cart
        public decimal Subtotal { get; set; }     // Subtotal of all items in the cart
        public decimal ShippingCost { get; set; } // Shipping cost for the cart
        public decimal Total => Subtotal + ShippingCost;  // Final total (Subtotal + Shipping)
    }
}
