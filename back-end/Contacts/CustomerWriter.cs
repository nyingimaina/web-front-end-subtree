using Jattac.Apps.CompanyMan.ContactAddresses;
using Jattac.Apps.CompanyMan.HttpHeaders;
using Rocket.Libraries.DatabaseIntegrator;
using Rocket.Libraries.FormValidationHelper;

namespace Jattac.Apps.CompanyMan.Contacts
{
    public interface IContactWriter : IDatabaseWriterBase<Contact>
    {
    }

    public class ContactWriter : DatabaseWriterBase<Contact>, IContactWriter
    {
        
        private readonly IContactAddressWriter customerAddressWriter;

        public ContactWriter(
            IDatabaseHelper<Guid> databaseHelper,
            IContactReader customerReader,
            IStandardHeaderReader headerReader,
            IContactAddressWriter customerAddressWriter)
            : base(databaseHelper, customerReader, headerReader)
        {
            this.customerAddressWriter = customerAddressWriter;
        }

        public override async Task<ValidationResponse<Guid>> UpsertAsync(Contact model)
        {
            var result = await base.UpsertAsync(model);
            result.FailReportClientVisibleMessagesIfAny();
            foreach (var contactAddress in model.ContactAddresses)
            {
                contactAddress.ContactId = model.Id;
                var customerAddressSaveResult = await customerAddressWriter.UpsertAsync(contactAddress);
                customerAddressSaveResult.FailReportClientVisibleMessagesIfAny();
            }
            return result;
        }
    }
}
