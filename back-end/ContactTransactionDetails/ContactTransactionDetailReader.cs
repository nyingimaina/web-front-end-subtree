using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.ContactTransactionDetails
{
    public interface IContactTransactionDetailReader : IDatabaseReaderBase<ContactTransactionDetail>
    {
    }

    public class ContactTransactionDetailReader : DatabaseReaderBase<ContactTransactionDetail>, IContactTransactionDetailReader
    {
        public ContactTransactionDetailReader(IDatabaseHelper<Guid> databaseHelper)
            : base(databaseHelper)
        {
        }
    }
}
