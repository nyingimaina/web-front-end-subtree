using Jattac.Apps.CompanyMan.HttpHeaders;
using Jattac.Apps.CompanyMan.Industries.PropertyManagement.PropManUnitContacts;
using Rocket.Libraries.DatabaseIntegrator;
using Rocket.Libraries.FormValidationHelper;

namespace Jattac.Apps.CompanyMan.Industries.PropertyManagement.PropManUnits
{
    public interface IPropManUnitWriter : IDatabaseWriterBase<PropManUnit>
    {

    }
    public class PropManUnitWriter : DatabaseWriterBase<PropManUnit>, IPropManUnitWriter
    {
        private readonly IPropManUnitContactWriter propManUnitContactWriter;

        public PropManUnitWriter(
            IDatabaseHelper<Guid> databaseHelper,
            IPropManUnitReader reader,
            IStandardHeaderReader headerReader,
            IPropManUnitContactWriter propManUnitContactWriter)
             : base(databaseHelper, reader, headerReader)
        {
            this.propManUnitContactWriter = propManUnitContactWriter;
        }

        public override async Task<ValidationResponse<Guid>> UpsertAsync(PropManUnit model)
        {
            var saveResponse = await base.UpsertAsync(model);
            saveResponse.FailReportClientVisibleMessagesIfAny();
            foreach (var propManUnitContact in model.PropManUnitContacts)
            {
                propManUnitContact.PropManUnitId = model.Id;
                var contactSaveResponse = await propManUnitContactWriter.UpsertAsync(propManUnitContact);
                contactSaveResponse.FailReportClientVisibleMessagesIfAny();
            }
            return saveResponse;
        }
    }
}