using System.Collections.Immutable;
using Jattac.Apps.CompanyMan.Contacts;
using Jattac.Apps.CompanyMan.HttpHeaders;
using Jattac.Apps.CompanyMan.InvoiceLineItems;
using Jattac.Apps.CompanyMan.Reporting;
using Jattac.Apps.CompanyMan.Security.Companies;
using Rocket.Libraries.DatabaseIntegrator;
using Rocket.Libraries.Qurious;
using Rocket.Libraries.Qurious.Builders;

namespace Jattac.Apps.CompanyMan.Invoices
{
    public interface IInvoiceReader : IDatabaseReaderBase<Invoice>
    {
        Task<Invoice?> GetSingleByIdAsync(Guid invoiceId);

        Task<Invoice?> GetByInvoiceLineItemId(Guid invoiceLineItemId);

        Task<ImmutableList<Invoice>> GetPageByTypeAsync(
            string invoiceType,
            List<string> include,
            DateTime startDate,
            DateTime endDate,
            int? page = null,
            ushort? pageSize = null);

        Task<ImmutableList<Invoice>> GetTotalByTypeAndPeriodAsync(
            string invoiceType,
            DateTime startDate,
            DateTime endDate);

        Task<ImmutableList<Invoice>> GetByManyContactIds(
            IEnumerable<Guid> contactIds,
            string invoiceType,
            DateTime startDate,
            DateTime endDate);
    }

    public class InvoiceReader : DatabaseReaderBase<Invoice>, IInvoiceReader
    {
        private readonly IInvoiceLineItemReader invoiceLineItemReader;
        private readonly IReportingHelper reportingHelper;
        private readonly IStandardHeaderReader standardHeaderReader;

        public InvoiceReader(
            IDatabaseHelper<Guid> databaseHelper,
            IInvoiceLineItemReader invoiceLineItemReader,
            IReportingHelper reportingHelper,
            IStandardHeaderReader standardHeaderReader)
            : base(databaseHelper)
        {
            this.invoiceLineItemReader = invoiceLineItemReader;
            this.reportingHelper = reportingHelper;
            this.standardHeaderReader = standardHeaderReader;
        }


        public async Task<Invoice?> GetSingleByIdAsync(Guid invoiceId)
        {
            var items = await GetPageableAsync(
                page: 1,
                pageSize: 1,
                pagingField: invoice => invoice.Id,
                orderAscending: true,
                onBeforeQuery: (qBuilder) =>
                {
                    qBuilder
                        .UseTableBoundFilter<Invoice>()
                        .WhereEqualTo(invoice => invoice.Id, invoiceId);
                }
            );
            return items.SingleOrDefault();
        }

        public async Task<Invoice?> GetByInvoiceLineItemId(Guid invoiceLineItemId)
        {
            var items = await GetPageableAsync(
                page: 1,
                pageSize: 1,
                pagingField: invoice => invoice.Id,
                orderAscending: true,
                onBeforeQuery: (qBuilder) =>
                {
                    qBuilder
                        .UseTableBoundFilter<InvoiceLineItem>()
                        .WhereEqualTo(invoiceLineItem => invoiceLineItem.Id, invoiceLineItemId);
                }
            );
            return items.FirstOrDefault();
        }

        public async Task<ImmutableList<Invoice>> GetPageByTypeAsync(
            string invoiceType,
            List<string> include,
            DateTime startDate,
            DateTime endDate,
            int? page = null,
            ushort? pageSize = null)
        {
            var sortedDates = reportingHelper.GetDatesSorted(startDate, endDate, toUniversalTime: true);

            var filters = new Dictionary<string, Action<WhereConjuntionBuilder, bool>>(StringComparer.OrdinalIgnoreCase)
            {
                // { InvoiceConstants.InvoiceWindows.Active, (where, value) => where.And<Invoice>().WhereEqualTo(invoice => invoice.Deleted, value ? 1 : 0) },
                { InvoiceConstants.InvoiceWindows.Archived, (where, value) => where.And<Invoice>().WhereEqualTo(invoice => invoice.Deleted, value ? 1 : 0) },
                { InvoiceConstants.InvoiceWindows.BadDebt, (where, value) => where.And<Invoice>().WhereEqualTo(invoice => invoice.BadDebt, value ? 1: 0) },
            };

            return await GetPageableAsync(
                page,
                pageSize,
                pagingField: invoice => invoice.Modified,
                orderAscending: false,
                onBeforeQuery: (qBuilder) =>
                {
                    var whereConjuntionBuilder = qBuilder
                        .UseTableBoundFilter<Invoice>()
                        .WhereEqualTo(invoice => invoice.InvoiceType, invoiceType);

                    foreach (var filter in filters)
                    {
                        if (include.Contains(filter.Key))
                        {
                            filter.Value(whereConjuntionBuilder, true);
                        }
                        else
                        {
                            filter.Value(whereConjuntionBuilder, false);
                        }
                    }
                    whereConjuntionBuilder
                        .And<Invoice>()
                        .WhereGreaterThanOrEqualTo(invoice => invoice.Dated, sortedDates.earlierDate.Date.ToMariaDbFormat())
                        .And<Invoice>()
                        .WhereLessThanOrEqualTo(invoice => invoice.Dated, sortedDates.laterDate.ToEndOfDay().ToMariaDbFormat())
                        .And<Invoice>();
                }
            );
        }
        public override async Task<ImmutableList<Invoice>> GetPageableAsync<TPageField>(int? page = null, ushort? pageSize = null, System.Linq.Expressions.Expression<Func<Invoice, TPageField>>? pagingField = null, bool orderAscending = true, Action<QBuilder>? onBeforeQuery = null)
        {
            var invoices = await base.GetPageableAsync(
                page,
                pageSize,
                pagingField,
                orderAscending,
                onBeforeQuery: (qBuilder) =>
                {
                    onBeforeQuery?.Invoke(qBuilder);
                    CommonSelectAndJoin(qBuilder);
                    if (standardHeaderReader.CompanyId != default)
                    {
                        qBuilder
                            .UseTableBoundFilter<Invoice>()
                            .WhereEqualTo(invoice => invoice.CompanyId, standardHeaderReader.CompanyId);
                    }
                });

            invoices = invoices
                .GroupBy(a => a.Id)
                .Select(a => a.First()) // We do this because by joining invoice line items we may get the same invoice multiple times
                .ToImmutableList();
            await EnrichAsync(invoices);
            return invoices;
        }

        private async Task EnrichAsync(ImmutableList<Invoice> invoices)
        {
            var invoiceIds = invoices
                .Select(a => a.Id).ToList();
            var invoiceLineItems = await invoiceLineItemReader.GetByManyInvoiceIdsAsync(
                invoiceIds: invoiceIds
            );

            foreach (var specificInvoiceId in invoiceIds)
            {
                var targetInvoice = invoices.Single(a => a.Id == specificInvoiceId);
                targetInvoice.Dated = targetInvoice.Dated.ToClientTimezone(
                    standardHeaderReader: standardHeaderReader
                );
                targetInvoice.InvoiceLineItems = invoiceLineItems.Where(a => a.InvoiceId == specificInvoiceId)
                    .ToImmutableList();

            }
        }

        public async Task<ImmutableList<Invoice>> GetTotalByTypeAndPeriodAsync(string invoiceType, DateTime startDate, DateTime endDate)
        {
            var sortedDates = reportingHelper.GetDatesSorted(startDate, endDate, toUniversalTime: true);

            var invoices = await GetPageableAsync(
                page: 1,
                pageSize: ushort.MaxValue,
                pagingField: invoice => invoice.Modified,
                orderAscending: false,
                onBeforeQuery: (qBuilder) =>
                {
                    qBuilder
                        .UseTableBoundFilter<Invoice>()
                        .WhereEqualTo(invoice => invoice.InvoiceType, invoiceType)
                        .And<Invoice>()
                        .WhereGreaterThanOrEqualTo(invoice => invoice.Dated, sortedDates.earlierDate.Date.ToMariaDbFormat())
                        .And<Invoice>()
                        .WhereLessThanOrEqualTo(invoice => invoice.Dated, sortedDates.laterDate.ToEndOfDay().ToMariaDbFormat())
                        .And<Invoice>()
                        .WhereEqualTo(invoice => invoice.CompanyId, standardHeaderReader.CompanyId)
                        .And<Invoice>()
                        .WhereEqualTo(invoice => invoice.Deleted, 0)
                        .And<Invoice>()
                        .WhereEqualTo(invoice => invoice.BadDebt, 0);
                }
            );

            return invoices;

        }


        public async Task<ImmutableList<Invoice>> GetByManyContactIds(
            IEnumerable<Guid> contactIds,
            string invoiceType,
            DateTime startDate,
            DateTime endDate)
        {
            var contactIdsList = contactIds?.ToList();
            if (contactIdsList == null || contactIdsList.Count == 0)
            {
                return ImmutableList<Invoice>.Empty;
            }

            var sortedDates = reportingHelper.GetDatesSorted(startDate, endDate, toUniversalTime: true);
            var invoices = await GetPageableAsync(
                page: 1,
                pageSize: ushort.MaxValue,
                pagingField: invoice => invoice.Modified,
                orderAscending: false,
                onBeforeQuery: (qBuilder) =>
                {
                    qBuilder
                        .UseTableBoundFilter<Invoice>()
                        .WhereEqualTo(invoice => invoice.InvoiceType, invoiceType)
                        .And<Invoice>()
                        .WhereGreaterThanOrEqualTo(invoice => invoice.Dated, sortedDates.earlierDate.Date.ToMariaDbFormat())
                        .And<Invoice>()
                        .WhereLessThanOrEqualTo(invoice => invoice.Dated, sortedDates.laterDate.ToEndOfDay().ToMariaDbFormat())
                        .And<Invoice>()
                        .WhereEqualTo(invoice => invoice.CompanyId, standardHeaderReader.CompanyId)
                        .And<Invoice>()
                        .WhereIn(invoice => invoice.ContactId, contactIdsList);
                }
            );

            return invoices;

        }

        private void CommonSelectAndJoin(QBuilder qBuilder)
        {
            qBuilder
                .UseTableBoundSelector<Contact>()
                .Select(customer => customer.DisplayLabel, nameof(Invoice.ContactDisplayLabel))
                .Then()
                .UseTableBoundSelector<Company>()
                .Select(company => company.Name, nameof(Invoice.CompanyDisplayLabel))
                .Then()
                .UseTableBoundJoinBuilder<Contact, Invoice>()
                .InnerJoin(customer => customer.Id, invoice => invoice.ContactId)
                .UseTableBoundJoinBuilder<Company, Invoice>()
                .InnerJoin(company => company.Id, invoice => invoice.CompanyId)
                .UseTableBoundJoinBuilder<InvoiceLineItem, Invoice>()
                .InnerJoin(invoiceLineItem => invoiceLineItem.InvoiceId, invoice => invoice.Id);

        }
    }
}
