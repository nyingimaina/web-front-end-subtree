using Jattac.Apps.CompanyMan.ExceptionHandlingMiddleware;
using Jattac.Apps.CompanyMan.HttpHeaders;
using Jattac.Apps.CompanyMan.Security.Authentication;
using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.Security.Users
{
    public interface IUserWriter : IDatabaseWriterBase<User>
    {
        Task<User> ToggleDeletionAsync(Guid userId, bool deleted);

        Task<User?> ManageAsync(User model);
    }
    public class UserWriter : DatabaseWriterBase<User>, IUserWriter
    {
        private readonly IUserReader reader;
        private readonly IUserRolesHandler userRolesHandler;
        private readonly IUserCreator userCreator;
        private readonly IPasswordHelper passwordHelper;

        public UserWriter(
            IDatabaseHelper<Guid> databaseHelper, 
            IUserReader reader,
            IUserRolesHandler userRolesHandler,
            IUserCreator userCreator,
            IStandardHeaderReader headerReader,
            IPasswordHelper passwordHelper)
             : base(databaseHelper, reader,headerReader)
        {
            this.reader = reader;
            this.userRolesHandler = userRolesHandler;
            this.userCreator = userCreator;
            this.passwordHelper = passwordHelper;
        }


        public  async Task<User?> ManageAsync(User model)
        {
            if (model.Id == default)
            {
                var saved = await userCreator.CreateUserAsync(model);
                return saved;
            }
            else
            {
                if (!string.IsNullOrEmpty(model.Password))
                {
                    model.Password = passwordHelper.HashPassword(model.Password);
                }
                var response = await base.UpsertAsync(model);
                response.FailReportClientVisibleMessagesIfAny();
                await userRolesHandler.SetUserRolesAsync(model);
                var user = await reader.GetByEmailAsync(model.Email, false);
                return user;
            }
        }

        public async Task<User> ToggleDeletionAsync(Guid userId, bool deleted)
        {
            var user = await reader.GetByIdAsync(id: userId, showDeleted: true);
            if (user == null)
            {
                throw new ClientVisibleInformationException(
                    message: $"Unknown user with id '{userId}'"
                );
            }
            user.Deleted = deleted;
            var saveResponse = await UpsertAsync(user);
            if(saveResponse.HasErrors)
            {
                throw new ClientVisibleInformationException(
                    message: saveResponse.ValidationErrors.First().Errors.First()
                );
            }
            return user;
        }
    }
}