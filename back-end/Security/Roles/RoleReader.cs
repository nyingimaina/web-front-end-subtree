using System.Collections.Immutable;
using Rocket.Libraries.DatabaseIntegrator;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.Security.Roles
{
    public interface IRoleReader : IDatabaseReaderBase<Role>
    {
        Task<Role?> GetByNameAsync(
            string name
        );

        Task<ImmutableList<Role>> GetAllRolesAsync();
    }
    public class RoleReader : DatabaseReaderBase<Role> , IRoleReader
    {
        public RoleReader(
            IDatabaseHelper<Guid> databaseHelper)
             : base(databaseHelper)
        {
        }

        public async Task<ImmutableList<Role>> GetAllRolesAsync()
        {
            using(var qBuilder = new QBuilder(parameterize: true))
            {
                qBuilder
                    .UseSelector()
                    .Select<Role>("*");

                return await qBuilder.GetManyAsync<Role>(DatabaseHelper);
            }
        }

        public async Task<Role?> GetByNameAsync(
            string name
        )
        {
            using(var qBuilder = new QBuilder(parameterize: true))
            {
                qBuilder
                    .UseSelector()
                    .Select<Role>("*")
                    .Then()
                    .UseTableBoundFilter<Role>()
                    .WhereEqualTo(role => role.RoleName, name);

                return await qBuilder.GetSingleAsync<Role>(DatabaseHelper);
            }
        }

        
    }
}