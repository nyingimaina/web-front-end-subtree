using Jattac.Apps.CompanyMan.ExceptionHandlingMiddleware;
using Jattac.Apps.CompanyMan.HttpHeaders;
using Rocket.Libraries.DatabaseIntegrator;
using Rocket.Libraries.FormValidationHelper;
using Rocket.Libraries.FormValidationHelper.Attributes.InBuilt.Strings;

namespace Jattac.Apps.CompanyMan.ContactAddresses
{
    public interface IContactAddressWriter : IDatabaseWriterBase<ContactAddress>
    {
    }

    public class ContactAddressWriter : DatabaseWriterBase<ContactAddress>, IContactAddressWriter
    {
        private readonly IContactAddressReader customerAddressReader;

        public ContactAddressWriter(
            IDatabaseHelper<Guid> databaseHelper,
            IContactAddressReader customerAddressReader,
            IStandardHeaderReader headerReader)
            : base(databaseHelper, customerAddressReader, headerReader)
        {
            this.customerAddressReader = customerAddressReader;
        }

        public override async Task<ValidationResponse<Guid>> UpsertAsync(ContactAddress model)
        {
            var isPhoneNumber = model.AddressType == ContactAddressTypes.PhoneNumber;
            if (isPhoneNumber)
            {
                var validator = new StringIsValidPhoneNumberWithCountryCodeOrDefault(displayLabel: "Phone Number", requireLeadingPlusSign: false);
                var isInvalid = validator.ValidationFailed(model.Value);
                if (isInvalid)
                {
                    throw new ClientVisibleInformationException(message: validator.ErrorMessage);
                }
            }
            return await UpsertAsync(model);
        }
    }
}
