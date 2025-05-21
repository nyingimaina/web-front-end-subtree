namespace Jattac.Apps.CompanyMan.FeedItemsUsers
{
    public class FeedItemUser : UserModel
    {
        public Guid AssignedToUserId { get; set; }
        public Guid FeedItemId { get; set; }

        public bool Actioned { get; set; }
    }
}