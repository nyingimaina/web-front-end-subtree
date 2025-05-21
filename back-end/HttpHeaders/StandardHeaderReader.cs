using Jattac.Apps.CompanyMan.Timezones;

namespace Jattac.Apps.CompanyMan.HttpHeaders
{
    public interface IStandardHeaderReader
    {
        Guid CompanyId { get; }
        Guid UserId { get; }

        string SignedInUsername { get; }

        string ApiKey { get; }

        int ClientTimezoneOffsetMinutes { get; }
    }
    public class StandardHeaderReader : IStandardHeaderReader
    {
        private readonly IHeaderReader headerReader;
        private readonly IStandardHeaderOverrider standardHeaderReaderEmulator;
        private string apiKey = string.Empty;
        private Guid companyId;
        private Guid userId;

        private string signedInUsername = string.Empty;

        private int clientTimezoneOffsetMinutes = 0;

        private bool hasPreloaded = false;

        public StandardHeaderReader(
            IHeaderReader headerReader,
            IStandardHeaderOverrider standardHeaderReaderEmulator
        )
        {
            this.headerReader = headerReader;
            this.standardHeaderReaderEmulator = standardHeaderReaderEmulator;
            Preload();
        }


        public Guid CompanyId
        {
            get
            {
                if (standardHeaderReaderEmulator.CompanyId != default)
                {
                    return standardHeaderReaderEmulator.CompanyId;
                }
                Preload();
                return companyId;
            }
        }

        public Guid UserId
        {
            get
            {
                if (standardHeaderReaderEmulator.UserId != default)
                {
                    return standardHeaderReaderEmulator.UserId;
                }
                Preload();
                return userId;
            }
        }

        public string SignedInUsername
        {
            get
            {
                Preload();
                return signedInUsername;
            }
        }

        public string ApiKey
        {
            get
            {
                Preload();
                return apiKey;
            }
        }

        public int ClientTimezoneOffsetMinutes
        {
            get
            {
                Preload();
                return clientTimezoneOffsetMinutes;
            }
        }

        private void Preload()
        {
            try
            {
                if (hasPreloaded)
                {
                    return;
                }
                companyId = new Guid(headerReader.GetHeaderValue(headerName: HeaderNames.CompanyId));
                userId = new Guid(headerReader.GetHeaderValue(headerName: HeaderNames.UserId));
                signedInUsername = headerReader.GetHeaderValue(
                    headerName: HeaderNames.SignedInUsername,
                    true);
                apiKey = headerReader.GetHeaderValue(headerName: HeaderNames.ApiKey, throwExceptionIfHeaderMissing: false);
                clientTimezoneOffsetMinutes = int.Parse(headerReader.GetHeaderValue(headerName: TimezoneOffsetMiddleware.TimezoneOffsetMinutes, throwExceptionIfHeaderMissing: true));
                hasPreloaded = true;
            }
            catch
            {

            }

        }
    }
}