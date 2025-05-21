using System.Collections.Immutable;
using Jattac.Apps.CompanyMan.Industries.PropertyManagement.UnreleasedPropManUnitContacts;
using Jattac.Apps.CompanyMan.Invoices;
using Rocket.Libraries.DatabaseIntegrator;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.Industries.PropertyManagement.PropManUnits
{
    public interface IPropManUnitReader : IDatabaseReaderBase<PropManUnit>
    {
        Task<ImmutableList<PropManUnit>> GetByCompanyIdAsync(Guid companyId, int? page, ushort? pageSize);

        Task<PropManUnit?> GetSingleByIdAsync(Guid id);
    }
    public class PropManUnitReader : DatabaseReaderBase<PropManUnit>, IPropManUnitReader
    {
        private readonly IUnreleasedPropManUnitContactReader unreleasedPropManUnitContactReader;
        private readonly IInvoiceReader invoiceReader;
        // private readonly IPaymentReader paymentReader;

        public PropManUnitReader(
            IDatabaseHelper<Guid> databaseHelper,
            IUnreleasedPropManUnitContactReader unreleasedPropManUnitContactReader,
            IInvoiceReader invoiceReader)
             : base(databaseHelper)
        {
            this.unreleasedPropManUnitContactReader = unreleasedPropManUnitContactReader;
            this.invoiceReader = invoiceReader;
        }


        public async Task<PropManUnit?> GetSingleByIdAsync(Guid id)
        {
            var items = await GetPageableAsync(
                page: 1,
                pageSize: 1,
                pagingField: propManUnit => propManUnit.Id,
                orderAscending: true,
                onBeforeQuery: (qBuilder) =>
                {
                    qBuilder
                        .UseTableBoundFilter<PropManUnit>()
                        .WhereEqualTo(propManUnit => propManUnit.Id, id);
                }
            );
            return items.SingleOrDefault();
        }


        public async Task<ImmutableList<PropManUnit>> GetByCompanyIdAsync(Guid companyId, int? page, ushort? pageSize)
        {
            return await GetPageableAsync(
                page: page,
                pageSize: pageSize,
                pagingField: propManUnit => propManUnit.Created,
                orderAscending: true,
                onBeforeQuery: (qBuilder) =>
                {
                    qBuilder
                        .UseTableBoundFilter<PropManUnit>()
                        .WhereEqualTo(propManUnit => propManUnit.CompanyId, companyId);
                });
        }

        public override async Task<ImmutableList<PropManUnit>> GetPageableAsync<TPageField>(int? page = null, ushort? pageSize = null, System.Linq.Expressions.Expression<Func<PropManUnit, TPageField>>? pagingField = null, bool orderAscending = true, Action<QBuilder>? onBeforeQuery = null)
        {
            var result = await base.GetPageableAsync(page, pageSize, pagingField, orderAscending, onBeforeQuery);
            await EnrichAsync(result);
            return result;
        }

        private async Task EnrichAsync(ImmutableList<PropManUnit> propManUnits)
        {
            var startDate = new DateTime(1990, 01, 01);
            var propManUnitIds = propManUnits.Select(t => t.Id).Distinct().ToList();
            var propManUnitContacts = await unreleasedPropManUnitContactReader.GetByManyPropManUnitIdsAsync(propManUnitIds, default, default);
            var contactIds = propManUnitContacts.Select(a => a.ContactId);
            var invoices = await invoiceReader.GetByManyContactIds(
                contactIds: contactIds,
                invoiceType: InvoiceTypeNames.Customer,
                startDate: startDate,
                endDate: DateTime.Now);

            // var payments = await paymentReader.GetByManyContactIds(
            //     contactIds: contactIds,
            //     invoiceType: InvoiceTypeNames.Customer,
            //     startDate: startDate,
            //     endDate: DateTime.Now);
            foreach (var specificPropManUnit in propManUnits)
            {
                specificPropManUnit.PropManUnitContacts = propManUnitContacts.Where(t => t.PropManUnitId == specificPropManUnit.Id).ToImmutableList();
                var unitContactIds = specificPropManUnit.PropManUnitContacts.Select(t => t.ContactId).Distinct().ToList();
                specificPropManUnit.Balance = invoices.Where(a => unitContactIds.Contains(a.ContactId)).Sum(a => a.Balance);
            }
        }
    }
}