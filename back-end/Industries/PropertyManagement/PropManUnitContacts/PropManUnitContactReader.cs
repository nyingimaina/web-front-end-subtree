using System.Collections.Immutable;
using Jattac.Apps.CompanyMan.ContactAddresses;
using Jattac.Apps.CompanyMan.Contacts;
using Jattac.Apps.CompanyMan.Industries.PropertyManagement.PropManUnits;
using Rocket.Libraries.DatabaseIntegrator;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.Industries.PropertyManagement.PropManUnitContacts
{
    public interface IPropManUnitContactReader : IDatabaseReaderBase<PropManUnitContact>
    {
        Task<ImmutableList<PropManUnitContact>> GetBySinglePropManUnitIdAsync(
            Guid propManUnitId,
            int? page,
            ushort? pageSize);

        Task<ImmutableList<PropManUnitContact>> GetByManyPropManUnitIdsAsync(
            IEnumerable<Guid> propManUnitIds,
            int? page,
            ushort? pageSize);
    }
    public class PropManUnitContactReader : DatabaseReaderBase<PropManUnitContact>, IPropManUnitContactReader
    {
        private readonly IContactAddressReader contactAddressReader;

        public PropManUnitContactReader(
            IDatabaseHelper<Guid> databaseHelper,
            IContactAddressReader contactAddressReader)
             : base(databaseHelper)
        {
            this.contactAddressReader = contactAddressReader;
        }

        public override async Task<ImmutableList<PropManUnitContact>> GetPageableAsync<TPageField>(int? page = null, ushort? pageSize = null, System.Linq.Expressions.Expression<Func<PropManUnitContact, TPageField>>? pagingField = null, bool orderAscending = true, Action<QBuilder>? onBeforeQuery = null)
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

        public async Task<ImmutableList<PropManUnitContact>> GetBySinglePropManUnitIdAsync(
            Guid propManUnitId,
            int? page,
            ushort? pageSize)
        {
            return await GetByManyPropManUnitIdsAsync([propManUnitId], page, pageSize);
        }

         public async Task<ImmutableList<PropManUnitContact>> GetByManyPropManUnitIdsAsync(
            IEnumerable<Guid> propManUnitIds,
            int? page,
            ushort? pageSize)
        {
            var list = propManUnitIds?.ToList();
            if(list == null || list.Count == 0) return ImmutableList<PropManUnitContact>.Empty;
            return await GetPageableAsync(
                page: page,
                pageSize: pageSize,
                pagingField: propManUnitContact => propManUnitContact.Modified,
                orderAscending: true,
                onBeforeQuery: (qBuilder) =>
                {
                    qBuilder
                        .UseTableBoundFilter<PropManUnitContact>()
                        .WhereIn(propManUnitContact => propManUnitContact.PropManUnitId, list);
                }
            );
        }

        private async Task EnrichAsync(ImmutableList<PropManUnitContact> propManUnitContacts)
        {
            var contactIds = propManUnitContacts.Select(t => t.ContactId).Distinct().ToList();
            var contacts = await contactAddressReader.GetManyByContactIdsAsync(contactIds);
            foreach (var specificPropManUnitContact in propManUnitContacts)
            {
                specificPropManUnitContact.ContactAddresses = contacts.Where(t => t.ContactId == specificPropManUnitContact.ContactId).ToImmutableList();
            }

        }

        private QBuilder CommonSelectAndJoin(QBuilder qBuilder)
        {
            qBuilder
                .UseTableBoundSelector<Contact>()
                .Select(contact => contact.DisplayLabel)
                .Select(contact => contact.ContactType, nameof(PropManUnitContact.ContactType))
                .Then()
                .UseTableBoundJoinBuilder<PropManUnit, PropManUnitContact>()
                .InnerJoin(propManUnit => propManUnit.Id, propManUnitContact => propManUnitContact.PropManUnitId)
                .UseTableBoundJoinBuilder<Contact, PropManUnitContact>()
                .InnerJoin(contact => contact.Id, propManUnitContact => propManUnitContact.ContactId);
            return qBuilder;
        }
    }
}