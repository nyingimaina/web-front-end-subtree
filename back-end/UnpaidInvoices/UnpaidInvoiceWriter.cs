using Jattac.Apps.CompanyMan.HttpHeaders;
using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.UnpaidInvoices
{
    public interface IUnpaidInvoiceWriter : IDatabaseWriterBase<UnpaidInvoice>
    {
    }

    public class UnpaidInvoiceWriter : DatabaseWriterBase<UnpaidInvoice>, IUnpaidInvoiceWriter
    {
        private readonly IUnpaidInvoiceReader unpaidInvoiceReader;

        public UnpaidInvoiceWriter(
            IDatabaseHelper<Guid> databaseHelper,
            IUnpaidInvoiceReader unpaidInvoiceReader,
            IStandardHeaderReader headerReader)
            : base(databaseHelper, unpaidInvoiceReader, headerReader)
        {
            this.unpaidInvoiceReader = unpaidInvoiceReader;
        }
    }
}
