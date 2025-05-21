using Jattac.Apps.CompanyMan.HttpHeaders;
using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.ViewInvoiceRepetitionTracking
{
    public interface IViewInvoiceRepetitionTrackerWriter : IDatabaseWriterBase<ViewInvoiceRepetitionTracker>
    {
    }
    public class ViewInvoiceRepetitionTrackerWriter : DatabaseWriterBase<ViewInvoiceRepetitionTracker> , IViewInvoiceRepetitionTrackerWriter
    {
        public ViewInvoiceRepetitionTrackerWriter(
            IDatabaseHelper<Guid> databaseHelper,
            IViewInvoiceRepetitionTrackerReader reader,
            IStandardHeaderReader headerReader)
             : base(databaseHelper, reader, headerReader)
        {
        }
    }
}