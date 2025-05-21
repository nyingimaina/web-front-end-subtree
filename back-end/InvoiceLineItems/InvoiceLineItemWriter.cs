using Jattac.Apps.CompanyMan.HttpHeaders;
using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.InvoiceLineItems
{
    public interface IInvoiceLineItemWriter : IDatabaseWriterBase<InvoiceLineItem>
    {
    }

    public class InvoiceLineItemWriter : DatabaseWriterBase<InvoiceLineItem>, IInvoiceLineItemWriter
    {
        private readonly IInvoiceLineItemReader invoiceLineItemReader;

        public InvoiceLineItemWriter(
            IDatabaseHelper<Guid> databaseHelper,
            IInvoiceLineItemReader invoiceLineItemReader,
            IStandardHeaderReader headerReader)
            : base(databaseHelper, invoiceLineItemReader, headerReader)
        {
            this.invoiceLineItemReader = invoiceLineItemReader;
        }
    }
}
