using Jattac.Apps.CompanyMan.HttpHeaders;
using Rocket.Libraries.DatabaseIntegrator;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.UrlShortening
{
    public interface IShortUrlCodeReader : IDatabaseReaderBase<ShortUrlCode>
    {
        Task<ShortUrlCode?> GetByCodeAsync(string code);
    }
    public class ShortUrlCodeReader : DatabaseReaderBase<ShortUrlCode> , IShortUrlCodeReader
    {
        private readonly IStandardHeaderReader standardHeaderReader;

        public ShortUrlCodeReader(
            IDatabaseHelper<Guid> databaseHelper,
            IStandardHeaderReader standardHeaderReader)
             : base(databaseHelper)
        {
            this.standardHeaderReader = standardHeaderReader;
        }

        public async Task<ShortUrlCode?> GetByCodeAsync(string code)
        {
            using (var qBuilder = new QBuilder(parameterize: true))
            {
                qBuilder
                    .UseSelector()
                    .Select<ShortUrlCode>("*")
                    .Then()
                    .UseTableBoundFilter<ShortUrlCode>()
                    .WhereEqualTo(shortUrlCode => shortUrlCode.Code, code);
                    
                return await qBuilder.GetSingleAsync<ShortUrlCode>(databaseHelper: DatabaseHelper);
            }
        }
    }
}