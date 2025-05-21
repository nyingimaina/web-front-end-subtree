using Jattac.Apps.CompanyMan.HttpHeaders;
using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.BillableItems
{
    public interface IBillableItemWriter : IDatabaseWriterBase<BillableItem>
    {
    }

    public class BillableItemWriter : DatabaseWriterBase<BillableItem>, IBillableItemWriter
    {
        private readonly IBillableItemReader billableItemReader;

        public BillableItemWriter(
            IDatabaseHelper<Guid> databaseHelper,
            IBillableItemReader billableItemReader,
            IStandardHeaderReader headerReader)
            : base(databaseHelper, billableItemReader, headerReader)
        {
            this.billableItemReader = billableItemReader;
        }
    }
}
