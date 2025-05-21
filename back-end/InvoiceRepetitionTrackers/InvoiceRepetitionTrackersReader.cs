using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.InvoiceRepetitionTrackers
{
    public interface IInvoiceRepetitionTrackersReader : IDatabaseReaderBase<InvoiceRepetitionTracker>
    {
    }

    public class InvoiceRepetitionTrackersReader : DatabaseReaderBase<InvoiceRepetitionTracker>, IInvoiceRepetitionTrackersReader
    {
        public InvoiceRepetitionTrackersReader(
            IDatabaseHelper<Guid> databaseHelper)
             : base(databaseHelper)
        {
        }


        

    }
}