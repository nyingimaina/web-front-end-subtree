using Jattac.Apps.CompanyMan.HttpHeaders;
using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.ContactTransactionDetails
{
    public interface IContactTransactionDetailWriter : IDatabaseWriterBase<ContactTransactionDetail>
    {
    }

    public class ContactTransactionDetailWriter : DatabaseWriterBase<ContactTransactionDetail>, IContactTransactionDetailWriter
    {
        private readonly IContactTransactionDetailReader contactTransactionDetailReader;

        public ContactTransactionDetailWriter(
            IDatabaseHelper<Guid> databaseHelper,
            IContactTransactionDetailReader contactTransactionDetailReader,
            IStandardHeaderReader headerReader)
            : base(databaseHelper, contactTransactionDetailReader, headerReader)
        {
            this.contactTransactionDetailReader = contactTransactionDetailReader;
        }
    }
}
