using System.Linq.Expressions;
using Jattac.Apps.CompanyMan.Routing;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.UnpaidInvoices
{
    public class UnpaidInvoicesRouter : CrudRouter<UnpaidInvoice, DateTime, IUnpaidInvoiceReader, IUnpaidInvoiceWriter>
    {
        public UnpaidInvoicesRouter()
        {
            this.RemoveRouteDescription(endpoint: "upsert");
        }

        public override string RouteName => "unpaid-invoices";

        protected override Expression<Func<UnpaidInvoice, DateTime>>? PagingField => unpaidInvoice => unpaidInvoice.Dated;

        protected override Action<QBuilder, string> SearchOnBeforeQuery => (_, __) => { };

        protected override HashSet<RouteDescription> CustomEndpoints => new HashSet<RouteDescription>
        {
            new RouteDescription(
                endpoint:"get-by-invoice-type-and-period",
                httpMethod:HttpMethod.Get,
                handler: (
                    IUnpaidInvoiceReader unpaidInvoiceReader,string invoiceType,
                    DateTime startDate,
                    DateTime endDate,
                    int? page = null,
                    ushort? pageSize = null) => unpaidInvoiceReader.GetByInvoiceTypeAndPeriodAsync(invoiceType, startDate, endDate, page, pageSize)
            )
        };
    }
}
