using System.Collections.Immutable;
using Jattac.Apps.CompanyMan.HttpHeaders;
using Jattac.Apps.CompanyMan.Invoices;
using Jattac.Apps.CompanyMan.Payments;

namespace Jattac.Apps.CompanyMan.Transactions
{
    public interface ITransactionReader
    {
        Task<ImmutableList<Transaction>> GetByContactId(
            Guid contactId,
             string invoiceType,
            DateTime startDate,
            DateTime endDate);
    }
    public class TransactionReader : ITransactionReader
    {
        private readonly IInvoiceReader invoiceReader;
        private readonly IPaymentReader paymentReader;
        private readonly IStandardHeaderReader standardHeaderReader;

        public TransactionReader(
            IInvoiceReader invoiceReader,
            IPaymentReader paymentReader,
            IStandardHeaderReader standardHeaderReader
        )
        {
            this.invoiceReader = invoiceReader;
            this.paymentReader = paymentReader;
            this.standardHeaderReader = standardHeaderReader;
        }

        public async Task<ImmutableList<Transaction>> GetByContactId(
            Guid contactId,
             string invoiceType,
            DateTime startDate,
            DateTime endDate)
        {
            var invoices = await invoiceReader.GetByManyContactIds(
                contactIds: [contactId],
                invoiceType: invoiceType,
                startDate: startDate,
                endDate: endDate
            );

            var payments = await paymentReader.GetByManyContactIds(
                contactIds: [contactId],
                invoiceType: invoiceType,
                startDate: startDate,
                endDate: endDate
            );

            var transactions = invoices.Select(a => new Transaction
            {
                ContactId = a.ContactId,
                Dated = a.Dated.ToClientTimezone(
                    standardHeaderReader
                ),
                Description = a.InvoiceNumberPadded,
                InvoiceAmount = a.GrossTotal
            })
            .ToImmutableList();

            transactions = transactions.AddRange(payments.Select(a => new Transaction
            {
                ContactId = contactId,
                Dated = a.Dated,
                Description = $"Payment For Inv: {a.InvoiceNumberPadded}",
                PaymentAmount = a.Amount
            }))
            .OrderByDescending(a => a.Dated)
            .ToImmutableList();

            return transactions;

        }
    }
}