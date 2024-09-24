namespace master_piece_project.Services
{
    public class PayPalConfiguration
    {
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public string Mode { get; set; } // "sandbox" or "live"
    }
}
