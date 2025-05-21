using System.Collections.Immutable;
using Jattac.Apps.CompanyMan.HttpHeaders;
using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.BillableItems
{
    public interface IBillableItemReader : IDatabaseReaderBase<BillableItem>
    {
        Task<ImmutableList<BillableItem>> SearchByTypeAsync(
            string searchText,
            string invoiceType,
            int? page,
            ushort? pageSize
        );
    }

    public class BillableItemReader : DatabaseReaderBase<BillableItem>, IBillableItemReader
    {
        private readonly IStandardHeaderReader standardHeaderReader;

        public BillableItemReader(
            IDatabaseHelper<Guid> databaseHelper,
            IStandardHeaderReader standardHeaderReader)
            : base(databaseHelper)
        {
            this.standardHeaderReader = standardHeaderReader;
        }

        public async Task<ImmutableList<BillableItem>> SearchByTypeAsync(
            string searchText,
            string invoiceType,
            int? page,
            ushort? pageSize
        )
        {
            return await GetPageableAsync(
                page: page,
                pageSize: pageSize,
                pagingField: billableItem => billableItem.Modified,
                orderAscending: false,
                onBeforeQuery: (qBuilder) =>
                {
                    qBuilder.UseTableBoundFilter<BillableItem>()
                    .WhereContains(billableItem => billableItem.DisplayLabel, searchText)
                    .And<BillableItem>()
                    .WhereEqualTo(billableItem => billableItem.InvoiceType, invoiceType)
                    .And<BillableItem>()
                    .WhereEqualTo(billableItem => billableItem.CompanyId, standardHeaderReader.CompanyId);
                }
            );
        }
    }
}
