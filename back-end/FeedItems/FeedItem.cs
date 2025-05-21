using Rocket.Libraries.FormValidationHelper.Attributes.InBuilt.DateAndTime;
using Rocket.Libraries.FormValidationHelper.Attributes.InBuilt.Strings;

namespace Jattac.Apps.CompanyMan.FeedItems
{
    public class FeedItem : UserModel
    {
        [StringIsNonNullable]
        public string Title { get; set; } = string.Empty;

         [StringIsNonNullable]

        public string Description { get; set; } = string.Empty;

        [StringIsNonNullable]

        public string Name { get; set; } = string.Empty;

        [DateMustBeFuture]
        public DateTime DueOn { get; set; }

        [StringIsNonNullable]
        public string UniqueIdentifier { get; set; } = string.Empty;       

    }
}