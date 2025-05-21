using System.Collections.Immutable;
using Jattac.Apps.CompanyMan.HttpHeaders;
using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.Security.Companies
{
    public interface ICompanyReader : IDatabaseReaderBase<Company>
    {
        Task<Company?> GetByNameAsync(
            string name
        );

        Task<ImmutableList<Company>> GetByTypeAsync(
            string companyType
        );

        Task<Company?> GetByApiKeyAsync(
            string apiKey
        );

        Task<Company?> GetCurrentCompanyAsync();
    }
    public class CompanyReader : DatabaseReaderBase<Company> , ICompanyReader
    {
        private readonly IStandardHeaderReader standardHeaderReader;

        public CompanyReader(
            IDatabaseHelper<Guid> databaseHelper,
            IStandardHeaderReader standardHeaderReader)
             : base(databaseHelper)
        {
            this.standardHeaderReader = standardHeaderReader;
        }


        public async Task<Company?> GetCurrentCompanyAsync()
        {
            var candidates = await GetPageableAsync(
                page: 1,
                pageSize: 1,
                pagingField: company => company.Id,
                orderAscending: true,
                onBeforeQuery: (qBuilder) =>
                {
                    qBuilder
                        .UseTableBoundFilter<Company>()
                        .WhereEqualTo(company => company.Id, standardHeaderReader.CompanyId);
                }
            );
            return candidates.SingleOrDefault();
        }

        public async Task<Company?> GetByNameAsync(
            string name
        )
        {
            using (var qBuilder = QBuilderExtensions.GetQBuilder())
            {
                qBuilder
                    .UseSelector()
                    .Select<Company>("*")
                    .Then()
                    .UseTableBoundFilter<Company>()
                    .WhereEqualTo(company => company.Name, name);

                return await qBuilder.GetSingleAsync<Company>(DatabaseHelper);
            }
        }


        public async Task<ImmutableList<Company>> GetByTypeAsync(
            string companyType
        )
        {
            using(var qBuilder = QBuilderExtensions.GetQBuilder())
            {
                qBuilder
                    .UseSelector()
                    .Select<Company>("*")
                    .Then()
                    .UseTableBoundFilter<Company>()
                    .WhereEqualTo(company => company.CompanyType, companyType);

                return await qBuilder.GetManyAsync<Company>(DatabaseHelper);
            }
        }

        public async Task<Company?> GetByApiKeyAsync(string apiKey)
        {
            var options = await GetPageableAsync(
                page: 1,
                pageSize: 1,
                pagingField: company => company.Id,
                orderAscending: true,
                onBeforeQuery: (qBuilder) =>
                {
                    qBuilder
                        .UseTableBoundFilter<Company>()
                        .WhereEqualTo(company => company.ApiKey, apiKey);
                }
            );
            return options.SingleOrDefault();
        }
    }
}