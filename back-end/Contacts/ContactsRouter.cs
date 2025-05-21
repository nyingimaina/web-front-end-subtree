using System.Linq.Expressions;
using Jattac.Apps.CompanyMan.Routing;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.Contacts
{
    public class ContactsRouter : CrudRouter<Contact, DateTime, IContactReader, IContactWriter>
    {
        
        public override string RouteName => "Contacts";

        protected override Expression<Func<Contact, DateTime>>? PagingField => contact => contact.Created;

        protected override Action<QBuilder, string> SearchOnBeforeQuery => (__, _) =>
        {
           
        };

        protected override HashSet<RouteDescription> CustomEndpoints => new HashSet<RouteDescription>
        {
            new RouteDescription(
                endpoint: "search-by-invoice-type",
                httpMethod: HttpMethod.Get,
                handler: async (IContactReader reader, string searchText, string invoiceType, int? page, ushort? pageSize) =>
                {
                    return await reader.SearchByInvoiceTypeAsync(
                        searchText: searchText,
                        invoiceType: invoiceType,
                        page: page,
                        pageSize: pageSize
                    );
                }),

            new RouteDescription(
                endpoint: "get-single-by-id",
                httpMethod: HttpMethod.Get,
                handler: async (IContactReader reader, Guid contactId) =>
                {
                    return await reader.GetSingleByIdAsync(contactId);
                }),

        };
    }
}
