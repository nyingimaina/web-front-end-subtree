using System.Text.Json;
using Jattac.Apps.CompanyMan.Contacts;
using Jattac.Apps.CompanyMan.HttpHeaders;
using Rocket.Libraries.DatabaseIntegrator;
using Rocket.Libraries.FormValidationHelper;

namespace Jattac.Apps.CompanyMan.Industries.PropertyManagement.PropManUnitContacts
{
    public interface IPropManUnitContactWriter : IDatabaseWriterBase<PropManUnitContact> { }
    public class PropManUnitContactWriter : DatabaseWriterBase<PropManUnitContact>, IPropManUnitContactWriter
    {
        private readonly IContactWriter contactWriter;

        public PropManUnitContactWriter(
            IDatabaseHelper<Guid> databaseHelper,
            IPropManUnitContactReader reader,
            IStandardHeaderReader headerReader,
            IContactWriter contactWriter)
             : base(databaseHelper, reader, headerReader)
        {
            this.contactWriter = contactWriter;
        }

        public override async Task<ValidationResponse<Guid>> UpsertAsync(PropManUnitContact model)
        {
            var contact = JsonSerializer.Deserialize<Contact>(JsonSerializer.Serialize(model))!;
            contact.Id = model.ContactId;
            var contactSaveResponse = await contactWriter.UpsertAsync(contact);
            contactSaveResponse.FailReportClientVisibleMessagesIfAny();
            model.ContactId = contact.Id;
            return await base.UpsertAsync(model);
        }
    }
}