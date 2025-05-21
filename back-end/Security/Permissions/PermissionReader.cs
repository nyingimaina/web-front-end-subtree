using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.Security.Permissions
{
    public interface IPermissionReader : IDatabaseReaderBase<Permission>
    {
        
    }
    public class PermissionReader : DatabaseReaderBase<Permission>, IPermissionReader
    {
        public PermissionReader(
            IDatabaseHelper<Guid> databaseHelper)
             : base(databaseHelper)
        {
        }
    }
}