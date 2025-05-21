using System.Linq.Expressions;
using Jattac.Apps.CompanyMan.Routing;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.BillableItems
{
    public class BillableItemsRouter : CrudRouter<BillableItem, DateTime, IBillableItemReader, IBillableItemWriter>
    {
        public BillableItemsRouter()
        {
            RemoveRouteDescription(
                endpoint: "search"
            );
        }

        public override string RouteName => "BillableItems";

        protected override Expression<Func<BillableItem, DateTime>>? PagingField => billableItem => billableItem.Created;

        protected override Action<QBuilder, string> SearchOnBeforeQuery => (_, __) => { };

        protected override HashSet<RouteDescription> CustomEndpoints => new HashSet<RouteDescription>
        {
            new RouteDescription(
                endpoint: "search-by-invoice-type",
                httpMethod: HttpMethod.Get,
                handler: (IBillableItemReader billableItemReader, string searchText, string invoiceType, int? page, ushort? pageSize) =>
                {
                    return billableItemReader.SearchByTypeAsync(searchText, invoiceType, page, pageSize);
                }
            )
        };
    }
}
