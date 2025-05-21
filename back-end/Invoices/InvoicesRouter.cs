using System.Linq.Expressions;
using Jattac.Apps.CompanyMan.Routing;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.Invoices
{
    public class InvoicesRouter : CrudRouter<Invoice, DateTime, IInvoiceReader, IInvoiceWriter>
    {
        

        public override string RouteName => "Invoices";

        protected override Expression<Func<Invoice, DateTime>>? PagingField => invoice => invoice.Created;

        protected override Action<QBuilder, string> SearchOnBeforeQuery => (_, __) => { };

        protected override HashSet<RouteDescription> CustomEndpoints => new HashSet<RouteDescription>
        {
            new RouteDescription(
                endpoint:"get-single-by-id",
                httpMethod: HttpMethod.Get,
                handler: async (IInvoiceReader reader, Guid invoiceId) => await reader.GetSingleByIdAsync(invoiceId)
            ),
            new RouteDescription(
                endpoint:"unpay",
                httpMethod: HttpMethod.Get,
                handler: async (IInvoiceWriter writer, Guid invoiceId) => await writer.UnpayAsync(invoiceId)
            ),
            new RouteDescription(
                endpoint:"get-page-by-type",
                httpMethod: HttpMethod.Get,
                handler: async (
                    IInvoiceReader reader,
                    string invoiceType,
                    int? page,
                    ushort? pageSize,
                    string includeList,
                    DateTime startDate,
                    DateTime endDate) =>{
                    return  await reader.GetPageByTypeAsync(
                        invoiceType: invoiceType,
                        include: includeList.Split(',').ToList(),
                        page: page,
                        pageSize: pageSize,
                        startDate: startDate,
                        endDate: endDate
                    );
                }
            ),
            new RouteDescription(
                endpoint:"get-by-type-and-date",
                httpMethod: HttpMethod.Get,
                handler: async (IInvoiceReader reader, string invoiceType, DateTime startDate, DateTime endDate) =>
                {
                    return await reader.GetTotalByTypeAndPeriodAsync(invoiceType, startDate: startDate, endDate: endDate);
                }
            ),
            new RouteDescription(
                endpoint: "toggle-archival",
                httpMethod: HttpMethod.Get,
                handler: async (IInvoiceWriter writer, Guid invoiceId) =>
                {
                    return await writer.ToggleArchivalAsync(invoiceId);
                }
            ),
            new RouteDescription(
                endpoint: "mark-as-bad-debt",
                httpMethod: HttpMethod.Get,
                handler: async (IInvoiceWriter writer, Guid invoiceId) =>
                {
                    return await writer.MarkAsBadDebt(invoiceId);
                }
            ),
            new RouteDescription(
                endpoint: "send-whatsapp-message",
                httpMethod: HttpMethod.Get,
                handler: async (IInvoiceSender invoiceSender, Guid invoiceId) =>
                {
                    return await invoiceSender.SendAsync(invoiceId);
                }
            ),
            new RouteDescription(
                endpoint: "write",
                httpMethod: HttpMethod.Post,
                handler: async (IInvoiceWriter invoiceWriter, Invoice invoice) =>
                {
                    return await invoiceWriter.WriteAsync(invoice, sendNotification: invoice.InvoiceType == InvoiceTypeNames.Customer);
                })  
        };
    }
}
