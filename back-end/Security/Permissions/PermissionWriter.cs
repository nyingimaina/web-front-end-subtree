using Jattac.Apps.CompanyMan.HttpHeaders;
using Jattac.Apps.CompanyMan.Setup;
using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.Security.Permissions
{
    public interface IPermissionWriter : IDatabaseWriterBase<Permission> , ISetupService
    {

    }
    public class PermissionWriter : DatabaseWriterBase<Permission>, IPermissionWriter
    {
        public PermissionWriter(
            IDatabaseHelper<Guid> databaseHelper, 
            IPermissionReader reader,
            IStandardHeaderReader headerReader)
             : base(databaseHelper, reader,headerReader)
        {
        }

        public  async Task ExecuteAsync()
        {
            var initialPermissions = new List<Permission>
            {
                new Permission
                {
                    Name = PermissionNames.ManagePermissions,
                    DisplayLabel = "Manage Permissions"
                },
                new Permission
                {
                    Name = PermissionNames.ManageUsers,
                    DisplayLabel = "Manage Users"
                },
                new Permission
                {
                    Name = PermissionNames.ApproveCopyBills,
                    DisplayLabel = "Approve Copy Bills"
                },
                new Permission
                {
                    Name = PermissionNames.RequestTelexRelease,
                    DisplayLabel = "Request Telex Release"
                }
            };


            foreach (var specificPermission in initialPermissions)
            {
                var saveResponse = await UpsertAsync(specificPermission);
                saveResponse.FailReportClientVisibleMessagesIfAny();
            }
        }
    }
}