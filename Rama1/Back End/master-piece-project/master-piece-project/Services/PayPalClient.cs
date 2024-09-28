using PayPalCheckoutSdk.Core;

namespace master_piece_project.Services
{
    public class PayPalClient : IPayPalClient
    {
        private readonly string _clientId = "AXPkcL9QqTkShSSLMuBM3eRlxzN9jOre7GFmmFCR-SN9HdwEQ3OuM3QD1_RaRT89MeFPrzIbX2axpX_M"; // Replace with your actual client ID
        private readonly string _clientSecret = "EN3khsaK_FBcC7d1fllayEOuaD56xbWbnYXZgW5us3QZZW25O8Uv8S6npst9rAvSpVsEUipc6rCB5crZ"; // Replace with your actual client secret

        public PayPalHttpClient GetClient()
        {
            var environment = new SandboxEnvironment(_clientId, _clientSecret); // Use live credentials in production
            return new PayPalHttpClient(environment);
        }
    }
}

