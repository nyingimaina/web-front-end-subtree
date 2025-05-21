using Jattac.Apps.CompanyMan.FeedItemsUsers;
using Jattac.Apps.CompanyMan.HttpHeaders;
using Jattac.Apps.CompanyMan.Security.Users;
using Rocket.Libraries.DatabaseIntegrator;
using Rocket.Libraries.FormValidationHelper;

namespace Jattac.Apps.CompanyMan.FeedItems
{
    public interface IFeedItemsWriter : IDatabaseWriterBase<FeedItem>
    {
        Task<ValidationResponse<Guid>> AssignToPermissionOwnersAsync(
            FeedItem feedItem,
            string permissionName
        );
    }
    public class FeedItemsWriter : DatabaseWriterBase<FeedItem> , IFeedItemsWriter
    {
        private readonly IUserReader userReader;
        private readonly IFeedItemsUserWriter feedItemsUserWriter;

        public FeedItemsWriter(
            IDatabaseHelper<Guid> databaseHelper, 
            IFeedItemReader reader, 
            IStandardHeaderReader headerReader,
            IUserReader userReader,
            IFeedItemsUserWriter feedItemsUserWriter)
             : base(databaseHelper, reader, headerReader)
        {
            this.userReader = userReader;
            this.feedItemsUserWriter = feedItemsUserWriter;
        }

        public async Task<ValidationResponse<Guid>> AssignToPermissionOwnersAsync(
            FeedItem feedItem,
            string permissionName
        )
        {
            var feedItemSaveResponse = await base.UpsertAsync(feedItem);
            

            feedItemSaveResponse.FailReportClientVisibleMessagesIfAny();
            var targetUsers = await userReader.GetWithPermissionAsync(
                permissionName: permissionName,
                preservePassword: false
            );

            foreach (var specificUser in targetUsers)
            {
                var saveResponse = await feedItemsUserWriter.UpsertAsync(new FeedItemUser
                {
                    Actioned = false,
                    AssignedToUserId = specificUser.Id,
                    FeedItemId = feedItem.Id
                });
                saveResponse.FailReportClientVisibleMessagesIfAny();
            }

            return feedItemSaveResponse;
        }

        public override Task<ValidationResponse<Guid>> UpsertAsync(FeedItem model)
        {
            throw new Exception($"Calling this method directly is not supported. Instead call '{nameof(AssignToPermissionOwnersAsync)}'");
        }

       
    }
}