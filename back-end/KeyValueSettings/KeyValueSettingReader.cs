using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Threading.Tasks;
using Jattac.Apps.CompanyMan.HttpHeaders;
using Jattac.Apps.CompanyMan.HttpQueryParams;
using Rocket.Libraries.DatabaseIntegrator;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.KeyValueSettings
{
    public interface IKeyValueSettingReader : IDatabaseReaderBase<KeyValueSetting>
    {
        Task<KeyValueSetting?> GetSingleByKeyAsync(string key);

        Task<ImmutableList<KeyValueSetting>> GetManyByKeysAsync(IEnumerable<string> keys);
    }
    public class KeyValueSettingReader : DatabaseReaderBase<KeyValueSetting>, IKeyValueSettingReader
    {
        private readonly IStandardHeaderReader standardHeaderReader;
        private readonly IStandardHttpQueryParamReader standardHttpQueryParamReader;

        public KeyValueSettingReader(
            IDatabaseHelper<Guid> databaseHelper,
            IStandardHeaderReader standardHeaderReader,
            IStandardHttpQueryParamReader standardHttpQueryParamReader)
             : base(databaseHelper)
        {
            this.standardHeaderReader = standardHeaderReader;
            this.standardHttpQueryParamReader = standardHttpQueryParamReader;
        }

        public async Task<KeyValueSetting?> GetSingleByKeyAsync(string key)
        {
            var candidates = await GetManyByKeysAsync([key]);
            return candidates.SingleOrDefault();
        }

        public async Task<ImmutableList<KeyValueSetting>> GetManyByKeysAsync(IEnumerable<string> keys)
        {
            var list = keys?.ToList();
            if (list == null || list.Count == 0)
            {
                return ImmutableList<KeyValueSetting>.Empty;
            }
            else
            {
                return await GetPageableAsync(
                    page: default,
                    pageSize: default,
                    pagingField: keyValueSetting => keyValueSetting.Modified,
                    orderAscending: true,
                    onBeforeQuery: (qBuilder) =>
                    {
                        qBuilder
                            .UseTableBoundFilter<KeyValueSetting>()
                            .WhereIn(keyValueSetting => keyValueSetting.Key, list);
                    }
                );
            }
        }

        public override Task<ImmutableList<KeyValueSetting>> GetPageableAsync<TPageField>(int? page = null, ushort? pageSize = null, System.Linq.Expressions.Expression<Func<KeyValueSetting, TPageField>>? pagingField = null, bool orderAscending = true, Action<QBuilder>? onBeforeQuery = null)
        {
            return base.GetPageableAsync(
                page: page,
                pageSize: pageSize,
                pagingField: pagingField,
                orderAscending: orderAscending,
                onBeforeQuery: (qBuilder) =>
                {
                    var companyId = standardHeaderReader.CompanyId;
                    if (companyId == Guid.Empty)
                    {
                        companyId = standardHttpQueryParamReader.CompanyId;
                    }
                    qBuilder
                        .UseTableBoundFilter<KeyValueSetting>()
                        .WhereEqualTo(keyValueSetting => keyValueSetting.CompanyId, companyId);
                    onBeforeQuery?.Invoke(qBuilder);  
                });
        }


    }
}