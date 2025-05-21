using Jattac.Apps.CompanyMan.HttpHeaders;
using Rocket.Libraries.DatabaseIntegrator;
using Rocket.Libraries.FormValidationHelper;

namespace Jattac.Apps.CompanyMan.FeedItemsUsers
{
    public interface IFeedItemsUserWriter : IDatabaseWriterBase<FeedItemUser>
    {
        Task<ValidationResponse<Guid>> SetActionedStateAsync(
            Guid id,
            bool actioned
        );
    }
    public class FeedItemsUserWriter : DatabaseWriterBase<FeedItemUser>, IFeedItemsUserWriter
    {
        private readonly IFeedItemsUserReader reader;

        public FeedItemsUserWriter(
            IDatabaseHelper<Guid> databaseHelper, 
            IFeedItemsUserReader reader, 
            IStandardHeaderReader headerReader)
             : base(databaseHelper, reader, headerReader)
        {
            this.reader = reader;
        }

         public async Task<ValidationResponse<Guid>> SetActionedStateAsync(
            Guid id,
            bool actioned
        )
        {
            var item = await reader.GetByIdAsync(id, showDeleted: false);
            if(item != null)
            {
                item.Actioned = actioned;
                var saveResponse = await UpsertAsync(item);
                saveResponse.FailReportClientVisibleMessagesIfAny();
                return saveResponse;
            }
            return new ValidationResponse<Guid>();
        }
    }
}