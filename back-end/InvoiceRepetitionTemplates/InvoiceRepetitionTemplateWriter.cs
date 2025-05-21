using Jattac.Apps.CompanyMan.HttpHeaders;
using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.InvoiceRepetitionTemplates
{
    public interface IInvoiceRepetitionTemplateWriter : IDatabaseWriterBase<InvoiceRepetitionTemplate>
    {

    }
    public class InvoiceRepetitionTemplateWriter :
        DatabaseWriterBase<InvoiceRepetitionTemplate>,
        IInvoiceRepetitionTemplateWriter
    {
        public InvoiceRepetitionTemplateWriter(
            IDatabaseHelper<Guid> databaseHelper,
            IInvoiceRepetitionTemplateReader reader,
            IStandardHeaderReader headerReader)
              : base(databaseHelper, reader, headerReader)
        {
        }
    }
}