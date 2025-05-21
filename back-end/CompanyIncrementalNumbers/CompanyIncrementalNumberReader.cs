using Jattac.Apps.CompanyMan.HttpHeaders;
using Rocket.Libraries.DatabaseIntegrator;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.CompanyIncrementalNumbers
{
    public interface ICompanyIncrementalNumberReader : IDatabaseReaderBase<CompanyIncrementalNumber>
    {
        Task<CompanyIncrementalNumber> GetAsync(
            string numberType
        );
    }
    public class CompanyIncrementalNumberReader : DatabaseReaderBase<CompanyIncrementalNumber>, ICompanyIncrementalNumberReader
    {

        private readonly IStandardHeaderReader standardHeaderReader;
        private static SemaphoreSlim semaphoreSlim = new SemaphoreSlim(1, 1);

        public CompanyIncrementalNumberReader(
            IDatabaseHelper<Guid> databaseHelper,
            IStandardHeaderReader standardHeaderReader
        ) : base(databaseHelper)
        {
            this.standardHeaderReader = standardHeaderReader;
        }


        public async Task<CompanyIncrementalNumber> GetAsync(
            string numberType
        )
        {
            using (var qBuilder = new QBuilder(parameterize: true))
            {
                qBuilder
                    .UseSelector()
                    .Select<CompanyIncrementalNumber>("*")
                    .Then()
                    .UseTableBoundFilter<CompanyIncrementalNumber>()
                    .WhereEqualTo(companyIncrementalNumber => companyIncrementalNumber.CompanyId, standardHeaderReader.CompanyId)
                    .And<CompanyIncrementalNumber>()
                    .WhereEqualTo(companyIncrementalNumber => companyIncrementalNumber.NumberType, numberType);

                var item = await qBuilder.GetSingleAsync<CompanyIncrementalNumber>(
                    databaseHelper: DatabaseHelper
                );
                return item ?? new CompanyIncrementalNumber
                {
                    NumberType = numberType,
                    LatestValue = 0
                };
            }
        }
    }
}