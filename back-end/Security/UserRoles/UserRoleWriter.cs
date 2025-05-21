using Jattac.Apps.CompanyMan.HttpHeaders;
using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.Security.UserRoles
{
    public interface IUserRoleWriter : IDatabaseWriterBase<UserRole>
    {

    }
    
    public class UserRoleWriter : DatabaseWriterBase<UserRole> , IUserRoleWriter
    {
        public UserRoleWriter(
            IDatabaseHelper<Guid> databaseHelper, 
            IUserRoleReader reader,
            IStandardHeaderReader headerReader)
             : base(databaseHelper, reader,headerReader)
        {
        }
    }
}