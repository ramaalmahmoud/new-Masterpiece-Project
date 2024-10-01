using master_piece_project.Models;

namespace master_piece_project.DTO
{
    public class CreateOrderDTO
    {
        public int UserId { get; set; }
        public decimal TotalAmount { get; set; }
        public string OrderStatus { get; set; }
        public DateTime OrderDate { get; set; }
        public string ShippingAddress { get; set; }

        // New properties for billing details
        public string BillingName { get; set; }
        public string BillingAddress { get; set; }
        public string BillingCity { get; set; }
        public string BillingPostalCode { get; set; }
        public string BillingCountry { get; set; }

        public List<int> Products { get; set; }
        public string PaymentMethod { get; set; }
    }

}
