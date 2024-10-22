using PayPalCheckoutSdk.Core;
using PayPalCheckoutSdk.Orders;

namespace master_piece_project.Services
{
    public class PayPalService
    {
        private readonly PayPalHttpClient _client;

        public PayPalService(IConfiguration configuration)
        {
            var clientId = configuration["PayPal:ClientId"];
            var secret = configuration["PayPal:Secret"];
            var isLive = configuration["PayPal:IsLive"] == "true";

            PayPalEnvironment environment;

            if (isLive)
            {
                environment = new LiveEnvironment(clientId, secret);
            }
            else
            {
                environment = new SandboxEnvironment(clientId, secret);
            }

            _client = new PayPalHttpClient(environment);
        }

        public async Task<Order> CreateOrder(decimal amount, string currency, string returnUrl, string cancelUrl)
        {
            var orderRequest = new OrderRequest()
            {
                CheckoutPaymentIntent = "CAPTURE",
                PurchaseUnits = new List<PurchaseUnitRequest>
                {
                    new PurchaseUnitRequest
                    {
                        AmountWithBreakdown = new AmountWithBreakdown
                        {
                            CurrencyCode = currency,
                            Value = amount.ToString("F2")
                        }
                    }
                },
                ApplicationContext = new ApplicationContext
                {
                    ReturnUrl = returnUrl,
                    CancelUrl = cancelUrl
                }
            };

            var request = new OrdersCreateRequest();
            request.Prefer("return=representation");
            request.RequestBody(orderRequest);

            var response = await _client.Execute(request);
            return response.Result<Order>();
        }

        public async Task<Order> CaptureOrder(string orderId)
        {
            var request = new OrdersCaptureRequest(orderId);
            request.RequestBody(new OrderActionRequest());

            var response = await _client.Execute(request);
            return response.Result<Order>();
        }
    }
}
