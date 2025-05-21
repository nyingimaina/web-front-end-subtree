using Rocket.Libraries.FormValidationHelper.Attributes.InBuilt.Strings;

namespace Jattac.Apps.CompanyMan.ContactAddresses
{
    public class ContactAddress : UserModel
    {
      
        public Guid ContactId { get; set; }

        [StringIsInSet(StringComparison.InvariantCulture, ContactAddressTypes.Email,ContactAddressTypes.PhoneNumber)]
        public string AddressType { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
    }
}
