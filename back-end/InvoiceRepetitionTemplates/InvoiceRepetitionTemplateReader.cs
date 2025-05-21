using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.InvoiceRepetitionTemplates
{

    public interface IInvoiceRepetitionTemplateReader : IDatabaseReaderBase<InvoiceRepetitionTemplate>
    {

    }
    public class InvoiceRepetitionTemplateReader :
        DatabaseReaderBase<InvoiceRepetitionTemplate>,
        IInvoiceRepetitionTemplateReader
    {
        public InvoiceRepetitionTemplateReader(
            IDatabaseHelper<Guid> databaseHelper)
             : base(databaseHelper)
        {
        }
    }
}