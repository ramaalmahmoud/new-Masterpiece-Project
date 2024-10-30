using PayPalCheckoutSdk.Core;
using PayPalCheckoutSdk.Orders;
using Microsoft.Extensions.Configuration;
using System.Globalization;

namespace master_piece_project.Services
{
    public class PayPalService
    {
        private readonly PayPalHttpClient _client;
        public PayPalService(string clientId, string clientSecret, bool isLive)
        {
            PayPalEnvironment environment;

            if (isLive)
            {
                environment = new LiveEnvironment(clientId, clientSecret);
            }
            else
            {
                environment = new SandboxEnvironment(clientId, clientSecret);
            }

            _client = new PayPalHttpClient(environment);
        }
        // Method to create an order
        public async Task<Order> CreateOrder(decimal amount, string currency, string returnUrl, string cancelUrl)
        {
            var orderRequest = new OrderRequest()
            {
                CheckoutPaymentIntent = "CAPTURE", // Use "CAPTURE" to immediately capture funds upon payment
                PurchaseUnits = new List<PurchaseUnitRequest>
                {
                    new PurchaseUnitRequest
                    {
                        AmountWithBreakdown = new AmountWithBreakdown
                        {
                            CurrencyCode = currency,
                            Value = amount.ToString("F2", CultureInfo.InvariantCulture) // Ensure correct decimal formatting
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
            request.Prefer("return=representation"); // Request full order representation in the response
            request.RequestBody(orderRequest);

            try
            {
                // Execute the PayPal order creation
                var response = await _client.Execute(request);
                return response.Result<Order>();
            }
            catch (Exception ex)
            {
                // Log the error or handle it as needed
                throw new Exception($"PayPal order creation failed: {ex.Message}", ex);
            }
        }

        // Method to capture an order
        public async Task<Order> CaptureOrder(string orderId)
        {
            var request = new OrdersCaptureRequest(orderId);
            request.RequestBody(new OrderActionRequest());

            try
            {
                // Execute the PayPal order capture
                var response = await _client.Execute(request);
                return response.Result<Order>();
            }
            catch (Exception ex)
            {
                // Log the error or handle it as needed
                throw new Exception($"PayPal order capture failed: {ex.Message}", ex);
            }
        }
    }
}
