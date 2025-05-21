using System.Linq.Expressions;
using Jattac.Apps.CompanyMan.Routing;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.ViewInvoiceRepetitionTracking
{
    public class ViewInvoiceRepetitionTrackerRouter : CrudRouter<ViewInvoiceRepetitionTracker, DateTime, IViewInvoiceRepetitionTrackerReader, IViewInvoiceRepetitionTrackerWriter>
    {
        public override string RouteName => "view-invoice-repetition-tracker";

        protected override Expression<Func<ViewInvoiceRepetitionTracker, DateTime>>? PagingField => vInvoiceRepetitionTracker => vInvoiceRepetitionTracker.NextScheduledDate;

        protected override Action<QBuilder, string> SearchOnBeforeQuery => (_, __) => { };

        protected override HashSet<RouteDescription> CustomEndpoints => new HashSet<RouteDescription>
        {
            new RouteDescription(
               endpoint:"get-by-invoice-type",
               httpMethod: HttpMethod.Get,
               handler: async (IViewInvoiceRepetitionTrackerReader reader, string invoiceType,int? page, ushort? pageSize) => 
               {
                   return await reader.GetByInvoiceType(
                       invoiceType: invoiceType,
                       page: page,
                       pageSize: pageSize);
               }),
        };
    }
}