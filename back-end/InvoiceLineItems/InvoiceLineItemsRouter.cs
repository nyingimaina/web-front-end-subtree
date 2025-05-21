using System.Linq.Expressions;
using Jattac.Apps.CompanyMan.Routing;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.InvoiceLineItems
{
    public class InvoiceLineItemsRouter : CrudRouter<InvoiceLineItem, DateTime, IInvoiceLineItemReader, IInvoiceLineItemWriter>
    {
        

        public override string RouteName => "InvoiceLineItems";

        protected override Expression<Func<InvoiceLineItem, DateTime>>? PagingField => invoiceLineItem => invoiceLineItem.Created;

        protected override Action<QBuilder, string> SearchOnBeforeQuery => (_, __) => { };

        protected override HashSet<RouteDescription> CustomEndpoints => new HashSet<RouteDescription>();
    }
}
