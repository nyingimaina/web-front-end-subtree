using System.Collections.Immutable;
using Jattac.Apps.CompanyMan.BillableItems;
using Jattac.Apps.CompanyMan.Payments;
using Rocket.Libraries.DatabaseIntegrator;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.InvoiceLineItems
{
    public interface IInvoiceLineItemReader : IDatabaseReaderBase<InvoiceLineItem>
    {
        Task<ImmutableList<InvoiceLineItem>> GetByManyInvoiceIdsAsync(
            IEnumerable<Guid> invoiceIds);
    }

    public class InvoiceLineItemReader : DatabaseReaderBase<InvoiceLineItem>, IInvoiceLineItemReader
    {
        private readonly IPaymentReader paymentReader;

        public InvoiceLineItemReader(
            IDatabaseHelper<Guid> databaseHelper,
            IPaymentReader paymentReader)
            : base(databaseHelper)
        {
            this.paymentReader = paymentReader;
        }

        public async Task<ImmutableList<InvoiceLineItem>> GetByManyInvoiceIdsAsync(
            IEnumerable<Guid> invoiceIds)
        {
            var list = invoiceIds?.ToList();
            if (list?.Count == 0)
            {
                return ImmutableList<InvoiceLineItem>.Empty;
            }
            var results = await GetPageableAsync(
                page: default,
                pageSize: default,
                pagingField: invoiceLineItem => invoiceLineItem.Modified,
                orderAscending: true,
                onBeforeQuery: (qBuilder) =>
                {
                    CommonSelectAndJoin(qBuilder);
                }
            );
            await EnrichAsync(results);
            return results;
        }

        private void CommonSelectAndJoin(QBuilder qBuilder)
        {
            qBuilder
                .UseTableBoundSelector<BillableItem>()
                .Select(billableItem => billableItem.DisplayLabel, nameof(InvoiceLineItem.BillableItemDisplayLabel))
                .Then()
                .UseTableBoundJoinBuilder<BillableItem, InvoiceLineItem>()
                .InnerJoin(billableItem => billableItem.Id, invoiceLineItem => invoiceLineItem.BillableItemId);
        }

        private async Task EnrichAsync(ImmutableList<InvoiceLineItem> invoiceLineItems)
        {
            var invoiceLineItemIds = invoiceLineItems.Select(a => a.Id).ToList();
            var payments = await paymentReader.GetByManyInvoiceLineItemIdsAsync(
                invoiceLineItemIds: invoiceLineItemIds
            );

            foreach (var specificInvoiceLineItemId in invoiceLineItemIds)
            {
                var targetInvoiceLineItem = invoiceLineItems.Single(a => a.Id == specificInvoiceLineItemId);
                targetInvoiceLineItem.Payments = payments.Where(a => a.InvoiceLineItemId == specificInvoiceLineItemId)
                    .ToImmutableList();

            }
        }
    }
}
