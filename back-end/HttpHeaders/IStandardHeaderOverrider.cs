namespace Jattac.Apps.CompanyMan.HttpHeaders
{
    public interface IStandardHeaderOverrider : IStandardHeaderReader
    {
        void SetCompanyId(Guid companyId);

        void SetUserId(Guid userId);
    }
    public class StandardHeaderReaderEmulator : IStandardHeaderOverrider
    {
        public Guid CompanyId { get; set; }

        public Guid UserId { get; set; }

        public void SetCompanyId(Guid companyId)
        {
            CompanyId = companyId;
        }

        public void SetUserId(Guid userId)
        {
            UserId = userId;
        }

        public string SignedInUsername => throw new NotImplementedException();

        public string ApiKey => throw new NotImplementedException();

        public int ClientTimezoneOffsetMinutes => throw new NotImplementedException();
    }
}