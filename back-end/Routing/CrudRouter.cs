using System.Linq.Expressions;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.Routing
{
    /// <summary>
    /// Rote CRUD
    /// </summary>
    /// <typeparam name="TModel">Model name</typeparam>
    /// <typeparam name="TPageField">type of field we are paging by</typeparam>
    /// <typeparam name="IReader">Standard reader</typeparam>
    /// <typeparam name="IWriter">Standard writer</typeparam>
    public abstract class CrudRouter<TModel,TPageField, IReader,IWriter> : CompanyManRouter
        where TModel : Model
        where IReader: IDatabaseReaderBase<TModel>
        where IWriter: IDatabaseWriterBase<TModel>
    {
        private HashSet<string> EndpointsToRemove = new HashSet<string>();
       


        private HashSet<RouteDescription> FinalEndpoints
        {
            get;
            set;
        } = new HashSet<RouteDescription>();
        protected abstract Expression<Func<TModel, TPageField>>? PagingField { get;  }

        protected abstract Action<QBuilder,string> SearchOnBeforeQuery { get; }

        protected virtual HashSet<RouteDescription> CustomEndpoints { get; } = new HashSet<RouteDescription>();

        private HashSet<RouteDescription> CommonEndpoints  => new HashSet<RouteDescription>
        {
            new RouteDescription(
                endpoint:"get-page",
                httpMethod: HttpMethod.Get,
                handler: async (IReader reader, int? page, ushort? pageSize) =>
                {
                    return await reader.GetPageableAsync(
                        page: page,
                        pageSize: pageSize,
                        pagingField: PagingField
                    );
                },
                summary: "Page through the records in the system"


            ),
            new RouteDescription(
                endpoint:"search",
                httpMethod: HttpMethod.Get,
                handler: async (IReader reader, string searchText, int? page, ushort? pageSize) =>
                {
                    return await reader.GetPageableAsync(
                        page: page,
                        pageSize: pageSize,
                        pagingField: PagingField,
                        onBeforeQuery: (qBuilder) =>
                        {
                            SearchOnBeforeQuery(qBuilder,searchText);
                        }
                    );
                },
                summary:"Search for a company. You may also optionally page the results."
            ),
            new RouteDescription(
                endpoint:"upsert",
                httpMethod: HttpMethod.Post,
                handler: async (IWriter writer, TModel model) =>
                {
                    return await writer.UpsertAsync(model);
                },
                summary: "Create or edit"
            ),
            // new RouteDescription(
            //     endpoint:"get-by-id",
            //     httpMethod: HttpMethod.Get,
            //     handler: async(IReader reader, Guid id) =>
            //     {
            //         return await reader.GetByIdAsync(id: id, showDeleted: true);
            //     }
            // )
        };

        protected void RemoveRouteDescription(string endpoint)
        {
            EndpointsToRemove.Add(endpoint);
        }

       

        public override HashSet<RouteDescription> RouteDescriptions
        {
            get
            {
                if (FinalEndpoints.Any())
                {
                    return FinalEndpoints;
                }
                FinalEndpoints = CommonEndpoints;
                foreach (var item in CustomEndpoints)
                {
                    FinalEndpoints.Add(item);
                }
                FinalEndpoints.RemoveWhere((item) => EndpointsToRemove.Contains(item.Endpoint, StringComparer.OrdinalIgnoreCase));
                return FinalEndpoints;
            }
        }
    }
}