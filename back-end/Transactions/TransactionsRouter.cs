using Jattac.Apps.CompanyMan.Routing;

namespace Jattac.Apps.CompanyMan.Transactions
{
    public class TransactionsRouter : CompanyManRouter
    {
        public override string RouteName => "transactions";

        public override HashSet<RouteDescription> RouteDescriptions => new HashSet<RouteDescription>
        {
            new RouteDescription(
                endpoint:"get-by-contact-id",
                httpMethod: HttpMethod.Get,
                handler: async (ITransactionReader transactionReader, Guid contactId, string invoiceType, DateTime startDate, DateTime endDate) =>
                {
                    return await transactionReader.GetByContactId(
                        contactId: contactId,
                        invoiceType: invoiceType,
                        startDate: startDate,
                        endDate: endDate
                    );
                }
            )
        };
    }
}