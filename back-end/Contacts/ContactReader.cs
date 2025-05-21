using System.Collections.Immutable;
using Jattac.Apps.CompanyMan.ContactAddresses;
using Jattac.Apps.CompanyMan.HttpHeaders;
using Rocket.Libraries.DatabaseIntegrator;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.Contacts
{
    public interface IContactReader : IDatabaseReaderBase<Contact>
    {
        Task<ImmutableList<Contact>> SearchByInvoiceTypeAsync(
            string searchText,
            string invoiceType,
            int? page,
            ushort? pageSize);

        Task<Contact?> GetSingleByIdAsync(Guid contactId);
    }

    public class ContactReader : DatabaseReaderBase<Contact>, IContactReader
    {
        private readonly IStandardHeaderReader standardHeaderReader;
        private readonly IContactAddressReader contactAddressReader;

        public ContactReader(
            IDatabaseHelper<Guid> databaseHelper,
            IStandardHeaderReader standardHeaderReader,
            IContactAddressReader contactAddressReader)
            : base(databaseHelper)
        {
            this.standardHeaderReader = standardHeaderReader;
            this.contactAddressReader = contactAddressReader;
        }

        public async Task<ImmutableList<Contact>> SearchByInvoiceTypeAsync(
            string searchText,
            string invoiceType,
            int? page,
            ushort? pageSize)

        {
            return await GetPageableAsync(
                page: page,
                pageSize: pageSize,
                pagingField: contact => contact.Modified,
                orderAscending: false,
                onBeforeQuery: (qBuilder) =>
                {
                    qBuilder.UseTableBoundFilter<Contact>()
                    .WhereContains(contact => contact.DisplayLabel, searchText)
                    .And<Contact>()
                    .WhereEqualTo(contact => contact.ContactType, invoiceType)
                    .And<Contact>()
                    .WhereEqualTo(contact => contact.CompanyId, standardHeaderReader.CompanyId);
                }
            );
        }

        public async Task<Contact?> GetSingleByIdAsync(Guid contactId)
        {
            var items = await GetPageableAsync(
                page: 1,
                pageSize: 1,
                pagingField: contact => contact.Id,
                orderAscending: true,
                onBeforeQuery: (qBuilder) =>
                {
                    qBuilder.UseTableBoundFilter<Contact>()
                    .WhereEqualTo(contact => contact.Id, contactId);
                }
            );
            return items.SingleOrDefault();
        }

        public override async Task<ImmutableList<Contact>> GetPageableAsync<TPageField>(int? page = null, ushort? pageSize = null, System.Linq.Expressions.Expression<Func<Contact, TPageField>>? pagingField = null, bool orderAscending = true, Action<QBuilder>? onBeforeQuery = null)
        {
            var results = await base.GetPageableAsync(page, pageSize, pagingField, orderAscending, onBeforeQuery);
            await EnrichAsync(results);
            return results;
        }

        private async Task EnrichAsync(ImmutableList<Contact> contacts)
        {
           var contactIds = contacts.Select(x => x.Id).ToList();
            var contactAddresses = await contactAddressReader.GetManyByContactIdsAsync(contactIds);
            foreach (var contact in contacts)
            {
                contact.ContactAddresses = contactAddresses.Where(x => x.ContactId == contact.Id).ToImmutableList();
            }
        }
    }
}
