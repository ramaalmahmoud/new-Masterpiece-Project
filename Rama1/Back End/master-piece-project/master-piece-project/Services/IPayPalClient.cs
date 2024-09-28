using PayPalCheckoutSdk.Core;

namespace master_piece_project.Services
{
    public interface IPayPalClient
    {
        PayPalHttpClient GetClient();
    }

}
