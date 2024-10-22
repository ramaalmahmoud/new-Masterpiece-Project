namespace master_piece_project.DTO
{
    public class PaymentRequestDTO
    {
      
            public int UserId { get; set; }
        public int OrderId { get; set; }
            public string PaymentType { get; set; } // "Appointment" or "Product"
            public decimal Amount { get; set; }
            public int? AppointmentId { get; set; } // Nullable
            public DateTime PaymentDate { get; set; }
        public string PaymentStatus { get; set; }
        public string PaymentMethod { get; set; } // طريقة الدفع مثل PayPal



    }
}
