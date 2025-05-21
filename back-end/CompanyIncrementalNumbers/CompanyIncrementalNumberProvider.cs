using Jattac.Apps.CompanyMan.HttpHeaders;

namespace Jattac.Apps.CompanyMan.CompanyIncrementalNumbers
{
    public interface ICompanyIncrementalNumberProvider
    {
        Task<long> ConsumeLatestAvailableAsync(
            string numberType
        );
    }
    public class CompanyIncrementalNumberProvider : ICompanyIncrementalNumberProvider
    {
        private readonly ICompanyIncrementalNumberWriter companyIncrementalNumberWriter;
        private readonly ICompanyIncrementalNumberReader companyIncrementalNumberReader;
        private readonly IStandardHeaderReader standardHeaderReader;
        private static SemaphoreSlim semaphoreSlim = new SemaphoreSlim(1, 1);

        public CompanyIncrementalNumberProvider(
            ICompanyIncrementalNumberWriter companyIncrementalNumberWriter,
            ICompanyIncrementalNumberReader companyIncrementalNumberReader,
            IStandardHeaderReader standardHeaderReader
        )
        {
            this.companyIncrementalNumberWriter = companyIncrementalNumberWriter;
            this.companyIncrementalNumberReader = companyIncrementalNumberReader;
            this.standardHeaderReader = standardHeaderReader;
        }

        public async Task<long> ConsumeLatestAvailableAsync(
            string numberType
        )
        {
            try
            {
                await semaphoreSlim.WaitAsync();
                var item = await companyIncrementalNumberReader.GetAsync(
                    numberType: numberType
                );
                var newLatest = ++item.LatestValue;
                item.LatestValue = newLatest;
                item.CompanyId = standardHeaderReader.CompanyId;
                item.UserId = standardHeaderReader.UserId;
                await companyIncrementalNumberWriter.UpsertAsync(item);
                return newLatest;
            }
            finally
            {
                semaphoreSlim.Release();
            }
        }
    }
}