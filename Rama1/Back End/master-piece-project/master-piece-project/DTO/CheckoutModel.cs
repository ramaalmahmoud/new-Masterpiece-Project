namespace master_piece_project.DTO
{

        public class CheckoutModel
        {
            public int UserId { get; set; }
            public string ShippingAddress { get; set; }
            public List<int> ProductIds { get; set; } // List of Product IDs
            public string PaymentType { get; set; }
            public decimal TotalAmount { get; set; }
            public string PaymentToken { get; set; } // Payment token from frontend
        }

    }

