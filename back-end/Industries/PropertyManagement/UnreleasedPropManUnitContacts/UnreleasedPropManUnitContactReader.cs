using System.Collections.Immutable;
using Jattac.Apps.CompanyMan.ContactAddresses;
using Jattac.Apps.CompanyMan.Contacts;
using Jattac.Apps.CompanyMan.Industries.PropertyManagement.PropManUnits;
using Rocket.Libraries.DatabaseIntegrator;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.Industries.PropertyManagement.UnreleasedPropManUnitContacts
{
    public interface IUnreleasedPropManUnitContactReader : IDatabaseReaderBase<UnreleasedPropManUnitContact>
    {
        Task<ImmutableList<UnreleasedPropManUnitContact>> GetBySinglePropManUnitIdAsync(
            Guid propManUnitId,
            int? page,
            ushort? pageSize);

        Task<ImmutableList<UnreleasedPropManUnitContact>> GetByManyPropManUnitIdsAsync(
            IEnumerable<Guid> propManUnitIds,
            int? page,
            ushort? pageSize);
    }

    public class UnreleasedPropManUnitContactReader : DatabaseReaderBase<UnreleasedPropManUnitContact>, IUnreleasedPropManUnitContactReader
    {
        private readonly IContactAddressReader contactAddressReader;

        public UnreleasedPropManUnitContactReader(
            IDatabaseHelper<Guid> databaseHelper,
            IContactAddressReader contactAddressReader)
             : base(databaseHelper)
        {
            this.contactAddressReader = contactAddressReader;
        }

        public override async Task<ImmutableList<UnreleasedPropManUnitContact>> GetPageableAsync<TPageField>(int? page = null, ushort? pageSize = null, System.Linq.Expressions.Expression<Func<UnreleasedPropManUnitContact, TPageField>>? pagingField = null, bool orderAscending = true, Action<QBuilder>? onBeforeQuery = null)
        {
            var result = await base.GetPageableAsync(
                page: page,
                pageSize: pageSize,
                pagingField: t => t.Modified,
                orderAscending: orderAscending,
                onBeforeQuery: (qBuilder) =>
                {
                    CommonSelectAndJoin(qBuilder);
                    onBeforeQuery?.Invoke(qBuilder);
                });
            await EnrichAsync(result);
            return result;
        }

        public async Task<ImmutableList<UnreleasedPropManUnitContact>> GetBySinglePropManUnitIdAsync(
            Guid propManUnitId,
            int? page,
            ushort? pageSize)
        {
            return await GetByManyPropManUnitIdsAsync([propManUnitId], page, pageSize);
        }

         public async Task<ImmutableList<UnreleasedPropManUnitContact>> GetByManyPropManUnitIdsAsync(
            IEnumerable<Guid> propManUnitIds,
            int? page,
            ushort? pageSize)
        {
            var list = propManUnitIds?.ToList();
            if(list == null || list.Count == 0) return ImmutableList<UnreleasedPropManUnitContact>.Empty;
            return await GetPageableAsync(
                page: page,
                pageSize: pageSize,
                pagingField: unreleasedPropManUnitContact => unreleasedPropManUnitContact.Modified,
                orderAscending: true,
                onBeforeQuery: (qBuilder) =>
                {
                    qBuilder
                        .UseTableBoundFilter<UnreleasedPropManUnitContact>()
                        .WhereIn(unreleasedPropManUnitContact => unreleasedPropManUnitContact.PropManUnitId, list);
                }
            );
        }

        private async Task EnrichAsync(ImmutableList<UnreleasedPropManUnitContact> propManUnitContacts)
        {
            var contactIds = propManUnitContacts.Select(t => t.ContactId).Distinct().ToList();
            var contacts = await contactAddressReader.GetManyByContactIdsAsync(contactIds);
            foreach (var specificUnreleasedPropManUnitContact in propManUnitContacts)
            {
                specificUnreleasedPropManUnitContact.ContactAddresses = contacts.Where(t => t.ContactId == specificUnreleasedPropManUnitContact.ContactId).ToImmutableList();
            }

        }

        private QBuilder CommonSelectAndJoin(QBuilder qBuilder)
        {
            qBuilder
                .UseTableBoundSelector<Contact>()
                .Select(contact => contact.DisplayLabel)
                .Select(contact => contact.ContactType, nameof(UnreleasedPropManUnitContact.ContactType))
                .Then()
                .UseTableBoundJoinBuilder<PropManUnit, UnreleasedPropManUnitContact>()
                .InnerJoin(propManUnit => propManUnit.Id, unreleasedPropManUnitContact => unreleasedPropManUnitContact.PropManUnitId)
                .UseTableBoundJoinBuilder<Contact, UnreleasedPropManUnitContact>()
                .InnerJoin(contact => contact.Id, unreleasedPropManUnitContact => unreleasedPropManUnitContact.ContactId);
            return qBuilder;
        }
    }
}