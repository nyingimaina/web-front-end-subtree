using System.Collections.Immutable;
using Jattac.Apps.CompanyMan.FeedItems;
using Jattac.Apps.CompanyMan.HttpHeaders;
using Jattac.Apps.CompanyMan.Security.Users;
using Rocket.Libraries.DatabaseIntegrator;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.FeedItemsUsers
{
    public interface IFeedItemsUserReader : IDatabaseReaderBase<FeedItemUser>
    {
        Task<ImmutableList<FeedItemUser>> GetByFeedItemUniqueIdentifier(
            string uniqueIdentifier,
            int? page,
            ushort? pageSize
        );
    }
    public class FeedItemsUserReader : DatabaseReaderBase<FeedItemUser>, IFeedItemsUserReader
    {
        
        private readonly IStandardHeaderReader standardHeaderReader;

        public FeedItemsUserReader(
            IDatabaseHelper<Guid> databaseHelper,
            IStandardHeaderReader standardHeaderReader)
             : base(databaseHelper)
        {
            this.standardHeaderReader = standardHeaderReader;
        }

        public async Task<ImmutableList<FeedItemUser>> GetByFeedItemUniqueIdentifier(
            string uniqueIdentifier,
            int? page,
            ushort? pageSize
        )
        {
            return await GetPageableAsync(
                page: page,
                pageSize: pageSize,
                pagingField: feedItemUser => feedItemUser.Created,
                orderAscending: true,
                onBeforeQuery: (qBuilder) =>
                {
                    CommonSelectAndJoin(qBuilder)
                        .UseTableBoundFilter<FeedItem>()
                        .WhereEqualTo(feedItem => feedItem.UniqueIdentifier, uniqueIdentifier)
                        .And<FeedItem>()
                        .WhereEqualTo(feedItem => feedItem.CompanyId, standardHeaderReader.CompanyId);

                }
            );
        }


        private QBuilder CommonSelectAndJoin(
            QBuilder qBuilder)
        {
            qBuilder
                .UseTableBoundJoinBuilder<FeedItem, FeedItemUser>()
                .InnerJoin(feedItem => feedItem.Id, feedItemUserName => feedItemUserName.FeedItemId)
                .UseTableBoundJoinBuilder<User, FeedItemUser>()
                .InnerJoin(user => user.Id, feedItemUser => feedItemUser.AssignedToUserId);

            return qBuilder;
        }
    }
}