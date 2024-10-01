using PayPalCheckoutSdk.Core;
using PayPalCheckoutSdk.Orders;

namespace master_piece_project.Services
{
    public class PayPalService
    {
        private PayPalEnvironment _environment;
        private PayPalHttpClient _client;

        public PayPalService(string clientId, string secret, bool isLive)
        {
            _environment = isLive
                ? new LiveEnvironment(clientId, secret)
                : new SandboxEnvironment(clientId, secret);
            _client = new PayPalHttpClient(_environment);
        }

        public async Task<Order> CreateOrder(decimal amount, string currency)
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
                    ReturnUrl = "https://your-frontend.com/success",
                    CancelUrl = "https://your-frontend.com/cancel"
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
