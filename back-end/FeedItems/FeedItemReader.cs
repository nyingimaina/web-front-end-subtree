using System.Collections.Immutable;
using Jattac.Apps.CompanyMan.FeedItemsUsers;
using Jattac.Apps.CompanyMan.HttpHeaders;
using Rocket.Libraries.DatabaseIntegrator;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.FeedItems
{
    public interface IFeedItemReader : IDatabaseReaderBase<FeedItem>
    {
        Task<ImmutableList<FeedItem>> GetForCurrentUserAsync(
            int? page,
            ushort? pageSize
        );
    }
    public class FeedItemReader : DatabaseReaderBase<FeedItem> , IFeedItemReader
    {
        private readonly IHeaderReader headerReader;

        public FeedItemReader(
            IDatabaseHelper<Guid> databaseHelper,
            IHeaderReader headerReader)
             : base(databaseHelper)
        {
            this.headerReader = headerReader;
        }

        public async Task<ImmutableList<FeedItem>> GetForCurrentUserAsync(
            int? page,
            ushort? pageSize
        )
        {
            return await GetPageableAsync(
                page: page,
                pageSize: pageSize,
                pagingField: feedItem => feedItem.Created,
                orderAscending: true,
                onBeforeQuery: (qBuilder) =>
                {
                    CommonSelectAndJoin(qBuilder);
                    var userId = headerReader.GetHeaderValue(HeaderNames.UserId);
                    qBuilder.UseTableBoundFilter<FeedItemUser>()
                    .WhereEqualTo(feedItemUser => feedItemUser.AssignedToUserId, userId)
                    .And<FeedItemUser>()
                    .WhereEqualTo(feedItemUser => feedItemUser.Actioned, 0);
                }
            );
        }

        private void CommonSelectAndJoin(QBuilder qBuilder)
        {
            qBuilder
                .UseTableBoundJoinBuilder<FeedItemUser, FeedItem>()
                .InnerJoin(feedItemUser => feedItemUser.FeedItemId, feedItem => feedItem.Id);
        }


    }
}