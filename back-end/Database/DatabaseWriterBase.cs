using Jattac.Apps.CompanyMan.HttpHeaders;
using Jattac.Apps.CompanyMan.Security.Users;
using Rocket.Libraries.DatabaseIntegrator;
using Rocket.Libraries.FormValidationHelper;

namespace Jattac.Apps.CompanyMan.Database
{
    public interface IDatabaseWriterBase<TModel> : IWriterBase<TModel, Guid>
        where TModel : Model
    {
        Task<ValidationResponse<Guid>> UpsertAsync(TModel model);
    }
    public class DatabaseWriterBase<TModel> : WriterBase<TModel, Guid>
        where TModel : Model
    {
        private readonly IStandardHeaderReader standardHeaderReader;

        public DatabaseWriterBase(
            IDatabaseHelper<Guid> databaseHelper, 
            IReaderBase<TModel, Guid> reader,
            IStandardHeaderReader standardHeaderReader)
             : base(databaseHelper, reader)
        {
            this.standardHeaderReader = standardHeaderReader;
        }

        public virtual async Task<ValidationResponse<Guid>> UpsertAsync(TModel model)
        {
            model.Modified = DateTime.UtcNow;
            SetUserIdIfRequired(model);
            SetCompanyIdIfRequired(model);
            
            if(model.Id == default)
            {
                model.Created = DateTime.UtcNow;
                model.Id = Guid.NewGuid();
                return await base.InsertAsync(model);
            }
            else
            {
                return await base.UpdateAsync(model);
            }
        }

        private void SetCompanyIdIfRequired(TModel model)
        {
            var excludeForInsert = new HashSet<Type> {
                typeof(User)
            };

            var isExcluded = excludeForInsert.Contains(model.GetType());
            if (isExcluded)
            {
                return;
            }
            var companyModel = model as CompanyModel;
            if(companyModel != null)
            {

                companyModel.CompanyId = standardHeaderReader.CompanyId;
                
            }
        }

        private void SetUserIdIfRequired(TModel model)
        {
            var userModel = model as UserModel;
            if(userModel != null)
            {
                userModel.UserId = standardHeaderReader.UserId;
            }
        }
    }
}