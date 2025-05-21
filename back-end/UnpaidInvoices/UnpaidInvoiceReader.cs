using System.Collections.Immutable;
using Jattac.Apps.CompanyMan.HttpHeaders;
using Jattac.Apps.CompanyMan.Reporting;
using Rocket.Libraries.DatabaseIntegrator;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.UnpaidInvoices
{
    public interface IUnpaidInvoiceReader : IDatabaseReaderBase<UnpaidInvoice>
    {
        Task<ImmutableList<UnpaidInvoice>> GetByInvoiceTypeAndPeriodAsync(
            string invoiceType,
            DateTime startDate,
            DateTime endDate,
            int? page = null,
            ushort? pageSize = null);
    }

    public class UnpaidInvoiceReader : DatabaseReaderBase<UnpaidInvoice>, IUnpaidInvoiceReader
    {
        private readonly IReportingHelper reportingHelper;
        private readonly IStandardHeaderReader standardHeaderReader;

        public UnpaidInvoiceReader(
            IDatabaseHelper<Guid> databaseHelper,
            IReportingHelper reportingHelper,
            IStandardHeaderReader standardHeaderReader)
            : base(databaseHelper)
        {
            this.reportingHelper = reportingHelper;
            this.standardHeaderReader = standardHeaderReader;
        }

        public override Task<ImmutableList<UnpaidInvoice>> GetPageableAsync<TPageField>(int? page = null, ushort? pageSize = null, System.Linq.Expressions.Expression<Func<UnpaidInvoice, TPageField>>? pagingField = null, bool orderAscending = true, Action<QBuilder>? onBeforeQuery = null)
        {
            return base.GetPageableAsync(
                page: page,
                pageSize: pageSize,
                pagingField: t => t.Dated,
                orderAscending: false,
                onBeforeQuery: onBeforeQuery);
        }

        public Task<ImmutableList<UnpaidInvoice>> GetByInvoiceTypeAndPeriodAsync(
            string invoiceType,
            DateTime startDate,
            DateTime endDate,
            int? page = null,
            ushort? pageSize = null)
        {
            var sortedDates = reportingHelper.GetDatesSorted(startDate, endDate, toUniversalTime: true);
            return base.GetPageableAsync(
                page: page,
                pageSize: pageSize,
                pagingField: t => t.Dated,
                orderAscending: false,
                onBeforeQuery: (qBuilder) =>
                {
                    qBuilder
                        .UseTableBoundFilter<UnpaidInvoice>()
                        .WhereEqualTo(t => t.InvoiceType, invoiceType)
                        .And<UnpaidInvoice>()
                        .WhereGreaterThanOrEqualTo(t => t.Dated, sortedDates.earlierDate.Date.ToMariaDbFormat())
                        .And<UnpaidInvoice>()
                        .WhereLessThanOrEqualTo(t => t.Dated, sortedDates.laterDate.ToEndOfDay().ToMariaDbFormat())
                        .And<UnpaidInvoice>()
                        .WhereEqualTo(t => t.CompanyId, standardHeaderReader.CompanyId)
                        .And<UnpaidInvoice>()
                        .WhereEqualTo(t => t.BadDebt, 0)
                        .And<UnpaidInvoice>()
                        .WhereEqualTo(t => t.Deleted, 0);
                }
            );
        }
    }


}
