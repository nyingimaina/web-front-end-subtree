using Jattac.Apps.CompanyMan.HttpHeaders;
using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.InvoiceRepetitionTrackers
{
    public interface IInvoiceRepetitionTrackersWriter : IDatabaseWriterBase<InvoiceRepetitionTracker>
    {
    }

    public class InvoiceRepetitionTrackersWriter : DatabaseWriterBase<InvoiceRepetitionTracker>, IInvoiceRepetitionTrackersWriter
    {
        public InvoiceRepetitionTrackersWriter(
            IDatabaseHelper<Guid> databaseHelper,
            IInvoiceRepetitionTrackersReader reader,
            IStandardHeaderReader headerReader)
             : base(databaseHelper, reader, headerReader)
        {
        }
    }
}