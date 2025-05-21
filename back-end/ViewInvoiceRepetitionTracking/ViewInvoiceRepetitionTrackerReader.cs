using System.Collections.Immutable;
using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.ViewInvoiceRepetitionTracking
{
    public interface IViewInvoiceRepetitionTrackerReader : IDatabaseReaderBase<ViewInvoiceRepetitionTracker>
    {
        Task<ImmutableList<ViewInvoiceRepetitionTracker>> GetByInvoiceType(
            string invoiceType,
            int? page,
            ushort? pageSize);

        Task<ImmutableList<ViewInvoiceRepetitionTracker>> GetDueForGenerationAsync();
    }
    public class ViewInvoiceRepetitionTrackerReader : DatabaseReaderBase<ViewInvoiceRepetitionTracker>, IViewInvoiceRepetitionTrackerReader
    {
        public ViewInvoiceRepetitionTrackerReader(
            IDatabaseHelper<Guid> databaseHelper)
             : base(databaseHelper)
        {
        }
        


        public async Task<ImmutableList<ViewInvoiceRepetitionTracker>> GetDueForGenerationAsync()
        {
            return await GetPageableAsync(
                page: 1,
                pageSize: 100,
                pagingField: vInvoiceRepetitionTracker => vInvoiceRepetitionTracker.NextScheduledDate,
                orderAscending: false,
                onBeforeQuery: (qBuilder) =>
                {
                    qBuilder
                        .UseTableBoundFilter<ViewInvoiceRepetitionTracker>()
                        .WhereLessThanOrEqualTo(viewInvoiceRepetitionTracker => viewInvoiceRepetitionTracker.NextScheduledDate, DateTime.UtcNow.ToMariaDbFormat());
                }
            );
        }

        public async Task<ImmutableList<ViewInvoiceRepetitionTracker>> GetByInvoiceType(
            string invoiceType,
            int? page,
            ushort? pageSize)
        {
            var results = await GetPageableAsync(
                page: page,
                pageSize: pageSize,
                pagingField: vInvoiceRepetitionTracker => vInvoiceRepetitionTracker.NextScheduledDate,
                orderAscending: false,
                onBeforeQuery: (qBuilder) =>
                {
                    qBuilder
                        .UseTableBoundFilter<ViewInvoiceRepetitionTracker>()
                        .WhereEqualTo(viewInvoiceRepetitionTracker => viewInvoiceRepetitionTracker.InvoiceType, invoiceType);
                }
            );
            return results;
        }
    }
}