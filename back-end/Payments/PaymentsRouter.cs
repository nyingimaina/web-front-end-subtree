using System.Linq.Expressions;
using Jattac.Apps.CompanyMan.Routing;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.Payments
{
    public class PaymentsRouter : CrudRouter<Payment, DateTime, IPaymentReader, IPaymentWriter>
    {
        

        public override string RouteName => "Payments";

        protected override Expression<Func<Payment, DateTime>>? PagingField => payment => payment.Created;

        protected override Action<QBuilder, string> SearchOnBeforeQuery => (_, __) => { };

        protected override HashSet<RouteDescription> CustomEndpoints => new HashSet<RouteDescription>
        {
            new RouteDescription(
                endpoint: "pay",
                httpMethod: HttpMethod.Post,
                handler: (IPaymentWriter writer, List<Payment> payments) => writer.PayAsync(payments),
                summary: "Pay a payment",
                description:"This endpoint is used to make a payment against an invoice"
            ),
            new RouteDescription(
                endpoint: "get-by-invoice-type-and-period",
                httpMethod: HttpMethod.Get,
                handler: (IPaymentReader reader, string invoiceType, DateTime startDate, DateTime endDate) => reader.GetPaymentsMadeByInvoiceTypeAndPeriodAsync(invoiceType, startDate, endDate),
                summary: "Get payments made by invoice type and period",
                description:"This endpoint is used to get payments made by invoice type and period"
            ),
            new RouteDescription(
                endpoint: "sum-by-invoice-type-and-period",
                httpMethod: HttpMethod.Get,
                handler: (IPaymentReader reader, string invoiceType, DateTime startDate, DateTime endDate) => reader.GetTotalPaymentsMadeByInvoiceTypeAndPeriodAsync(
                    invoiceType: invoiceType,
                    startDate: startDate,
                    endDate: endDate
                )
            ),
        };
    }
}
