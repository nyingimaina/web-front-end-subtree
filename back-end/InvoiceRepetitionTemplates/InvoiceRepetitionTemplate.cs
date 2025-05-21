using Rocket.Libraries.FormValidationHelper.Attributes.InBuilt.Numbers;

namespace Jattac.Apps.CompanyMan.InvoiceRepetitionTemplates
{
    /// <summary>
    /// Represents a template for repeating invoices.
    /// </summary>
    public class InvoiceRepetitionTemplate : UserModel
    {
        public Guid InvoiceId { get; set; }

        /// <summary>
        /// Gets or sets the day of the month on which this repetition occurs.
        /// </summary>
        [MaximumNumber(28, "Day Of Month For Invoice Raising")]
        [MinimumNumber(1,"Day Of Month For Invoice Raising")]
        public int Day { get; set; }
    }
}
