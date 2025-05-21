using System.Collections.Immutable;
using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.ContactAddresses
{
    public interface IContactAddressReader : IDatabaseReaderBase<ContactAddress>
    {
        Task<ImmutableList<ContactAddress>> GetManyByContactIdsAsync(
            IEnumerable<Guid> contactIds
        );
    }

    public class ContactAddressReader : DatabaseReaderBase<ContactAddress>, IContactAddressReader
    {
        public ContactAddressReader(IDatabaseHelper<Guid> databaseHelper)
            : base(databaseHelper)
        {
        }

        public async Task<ImmutableList<ContactAddress>> GetManyByContactIdsAsync(
            IEnumerable<Guid> contactIds
        )
        {
            var list = contactIds?.ToList();
            if (list == null || list.Count == 0)
            {
                return ImmutableList<ContactAddress>.Empty;
            }
            else
            {
                return await GetPageableAsync(
                    page: default,
                    pageSize: default,
                    pagingField: contactAddress => contactAddress.Modified,
                    orderAscending: true,
                    onBeforeQuery: (qBuilder) =>
                    {
                        qBuilder
                            .UseTableBoundFilter<ContactAddress>()
                            .WhereIn(contactAddress => contactAddress.ContactId, list);
                    }
                );
            }
        }
        
    }
}
