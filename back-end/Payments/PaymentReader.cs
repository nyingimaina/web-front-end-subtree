using System.Collections.Immutable;
using Jattac.Apps.CompanyMan.HttpHeaders;
using Jattac.Apps.CompanyMan.InvoiceLineItems;
using Jattac.Apps.CompanyMan.Invoices;
using Jattac.Apps.CompanyMan.Reporting;
using Rocket.Libraries.DatabaseIntegrator;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.Payments
{
    public interface IPaymentReader : IDatabaseReaderBase<Payment>
    {
        Task<ImmutableList<Payment>> GetByManyInvoiceLineItemIdsAsync(
            IEnumerable<Guid> invoiceLineItemIds);

        Task<ImmutableList<Payment>> GetPaymentsMadeByInvoiceTypeAndPeriodAsync(
            string invoiceType,
            DateTime startDate,
            DateTime endDate);

        Task<ImmutableList<Payment>> GetByManyContactIds(
            IEnumerable<Guid> contactIds,
            string invoiceType,
            DateTime startDate,
            DateTime endDate);

        Task<decimal> GetTotalPaymentsMadeByInvoiceTypeAndPeriodAsync(
            string invoiceType,
            DateTime startDate,
            DateTime endDate);
    }

    public class PaymentReader : DatabaseReaderBase<Payment>, IPaymentReader
    {
        private readonly IReportingHelper reportingHelper;
        private readonly IStandardHeaderReader standardHeaderReader;

        public PaymentReader(
            IDatabaseHelper<Guid> databaseHelper,
            IReportingHelper reportingHelper,
            IStandardHeaderReader standardHeaderReader)
            : base(databaseHelper)
        {
            this.reportingHelper = reportingHelper;
            this.standardHeaderReader = standardHeaderReader;
        }

        public async Task<ImmutableList<Payment>> GetByManyInvoiceLineItemIdsAsync(
            IEnumerable<Guid> invoiceLineItemIds)
        {

            var list = invoiceLineItemIds?.ToList();
            if (list?.Count == 0)
            {
                return ImmutableList<Payment>.Empty;
            }
            var result = await GetPageableAsync(
                page: 1,
                pageSize: default,
                pagingField: payment => payment.Dated,
                orderAscending: false,
                onBeforeQuery: (qBuilder) =>
                {

                    qBuilder
                        .UseTableBoundFilter<Payment>()
                        .WhereIn(payment => payment.InvoiceLineItemId, list);
                });
            return result;
        }

        public override Task<ImmutableList<Payment>> GetPageableAsync<TPageField>(int? page = null, ushort? pageSize = null, System.Linq.Expressions.Expression<Func<Payment, TPageField>>? pagingField = null, bool orderAscending = true, Action<QBuilder>? onBeforeQuery = null)
        {
            return base.GetPageableAsync(
                page: page,
                pageSize: pageSize,
                pagingField: pagingField,
                orderAscending: orderAscending,
                onBeforeQuery: (qbuilder) =>
                {
                    CommonSelectAndJoin(qbuilder);
                    onBeforeQuery?.Invoke(qbuilder);
                });
        }

        public async Task<ImmutableList<Payment>> GetPaymentsMadeByInvoiceTypeAndPeriodAsync(string invoiceType, DateTime startDate, DateTime endDate)
        {
            var sortedDates = reportingHelper.GetDatesSorted(startDate, endDate, toUniversalTime: true);
            var payments = await GetPageableAsync(
                page: 1,
                pageSize: ushort.MaxValue,
                pagingField: payment => payment.Dated,
                orderAscending: false,
                onBeforeQuery: (qBuilder) =>
                {
                    qBuilder
                        .UseTableBoundFilter<Payment>()
                        .WhereGreaterThanOrEqualTo(payment => payment.Dated, sortedDates.earlierDate.Date.ToMariaDbFormat())
                        .And<Payment>()
                        .WhereLessThanOrEqualTo(payment => payment.Dated, sortedDates.laterDate.ToEndOfDay().ToMariaDbFormat())
                        .And<Invoice>()
                        .WhereEqualTo(invoice => invoice.InvoiceType, invoiceType)
                        .And<Invoice>()
                        .WhereEqualTo(invoice => invoice.CompanyId, standardHeaderReader.CompanyId);
                });
            return payments;
        }


        public async Task<ImmutableList<Payment>> GetByManyContactIds(
            IEnumerable<Guid> contactIds,
            string invoiceType,
            DateTime startDate,
            DateTime endDate)
        {

            var contactIdsList = contactIds?.ToList();
            if (contactIdsList == null || contactIdsList.Count == 0)
            {
                return ImmutableList<Payment>.Empty;
            }
            var sortedDates = reportingHelper.GetDatesSorted(startDate, endDate, toUniversalTime: true);
            var payments = await GetPageableAsync(
                page: 1,
                pageSize: ushort.MaxValue,
                pagingField: payment => payment.Dated,
                orderAscending: false,
                onBeforeQuery: (qBuilder) =>
                {
                    qBuilder
                        .UseTableBoundFilter<Payment>()
                        .WhereGreaterThanOrEqualTo(payment => payment.Dated, sortedDates.earlierDate.Date.ToMariaDbFormat())
                        .And<Payment>()
                        .WhereLessThanOrEqualTo(payment => payment.Dated, sortedDates.laterDate.ToEndOfDay().ToMariaDbFormat())
                        .And<Invoice>()
                        .WhereEqualTo(invoice => invoice.InvoiceType, invoiceType)
                        .And<Invoice>()
                        .WhereEqualTo(invoice => invoice.CompanyId, standardHeaderReader.CompanyId)                        
                        .And<Invoice>()
                        .WhereIn(invoice => invoice.ContactId, contactIdsList);
                });
            return payments;
        }

        public async Task<decimal> GetTotalPaymentsMadeByInvoiceTypeAndPeriodAsync(string invoiceType, DateTime startDate, DateTime endDate)
        {
            var sortedDates = reportingHelper.GetDatesSorted(startDate, endDate, toUniversalTime: true);
            using (var qBuilder = new QBuilder(parameterize: true))
            {
                CommonSelectAndJoin(qBuilder);
                qBuilder
                    .UseTableBoundSelector<Payment>()
                    .SelectAggregated(payment => payment.Amount, fieldAlias: nameof(Payment.Amount), aggregateFunction: "SUM")
                    .Then()
                    .UseTableBoundFilter<Invoice>()
                    .WhereGreaterThanOrEqualTo(payment => payment.Dated, sortedDates.earlierDate.Date.ToMariaDbFormat())
                    .And<Payment>()
                    .WhereLessThanOrEqualTo(payment => payment.Dated, sortedDates.laterDate.ToEndOfDay().ToMariaDbFormat())
                    .And<Invoice>()
                    .WhereEqualTo(invoice => invoice.InvoiceType, invoiceType)
                    .And<Invoice>()
                    .WhereEqualTo(invoice => invoice.CompanyId, standardHeaderReader.CompanyId)
                    .And<Invoice>()
                    .WhereEqualTo(invoice => invoice.Deleted, 0)
                    .And<Invoice>()
                    .WhereEqualTo(invoice => invoice.BadDebt, 0);

                var result = await qBuilder.GetSingleAsync<Payment>(DatabaseHelper);
                if (result == null)
                {
                    return 0;
                }
                else
                {
                    return result.Amount;
                }
                
            }
        }

        private QBuilder CommonSelectAndJoin(QBuilder qBuilder)
        {
            qBuilder
                .UseTableBoundSelector<Invoice>()
                .Select(invoice => invoice.InvoiceNumber, nameof(Payment.InvoiceNumber))
                .Then()
                .UseTableBoundJoinBuilder<Payment, InvoiceLineItem>()
                .InnerJoin(payment => payment.InvoiceLineItemId, invoiceLineItem => invoiceLineItem.Id)
                .UseTableBoundJoinBuilder<Invoice, InvoiceLineItem>()
                .InnerJoin(invoice => invoice.Id, invoiceLineItem => invoiceLineItem.InvoiceId);

            return qBuilder;
        }
    }
}
