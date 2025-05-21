using System.Linq.Expressions;
using Jattac.Apps.CompanyMan.Routing;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.FeedItems
{
    public class FeedItemsRouter : CrudRouter<FeedItem, DateTime, IFeedItemReader, IFeedItemsWriter>
    {
        

        public override string RouteName => "FeedItems";

        protected override Expression<Func<FeedItem, DateTime>>? PagingField => feedItem => feedItem.Created;

        protected override Action<QBuilder, string> SearchOnBeforeQuery => (_, __) => { };

        protected override HashSet<RouteDescription> CustomEndpoints => new HashSet<RouteDescription>
        {
            new RouteDescription(
                endpoint: "get-for-current-user",
                httpMethod: HttpMethod.Get,
                handler: async (IFeedItemReader feedItemReader, int? page, ushort? pageSize) =>
                {
                    return await feedItemReader.GetForCurrentUserAsync(
                        page: page,
                        pageSize: pageSize
                    );
                }
            ),
        };
    }
} 