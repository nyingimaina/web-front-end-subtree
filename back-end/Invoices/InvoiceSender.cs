using Jattac.Apps.CompanyMan.AppSetting;
using Jattac.Apps.CompanyMan.ContactAddresses;
using Jattac.Apps.CompanyMan.Contacts;
using Jattac.Apps.CompanyMan.UrlShortening;
using Jattac.Apps.CompanyMan.WhatsAppSending;
using Microsoft.Extensions.Options;

namespace Jattac.Apps.CompanyMan.Invoices
{
    public interface IInvoiceSender
    {
        Task<bool> SendAsync(Guid invoiceId);
    }
    public class InvoiceSender : IInvoiceSender
    {
        private readonly AppSettings appSettings;
        private readonly IUrlShortener urlShortener;
        private readonly IWhatsAppSender whatsAppSender;
        private readonly IInvoiceReader invoiceReader;
        private readonly IContactReader contactReader;

        public InvoiceSender(
            IOptions<AppSettings> appSettingsValue,
            IUrlShortener urlShortener,
            IWhatsAppSender whatsAppSender,
            IInvoiceReader invoiceReader,
            IContactReader contactReader
        )
        {
            appSettings = appSettingsValue.Value;
            this.urlShortener = urlShortener;
            this.whatsAppSender = whatsAppSender;
            this.invoiceReader = invoiceReader;
            this.contactReader = contactReader;
        }

        public async Task<bool> SendAsync(Guid invoiceId)
        {
            var invoice = await invoiceReader.GetSingleByIdAsync(invoiceId);
            if (invoice == null)
            {
                throw new Exception($"Could not find invoice with id {invoiceId} to send.");
            }
            var invoiceUrl = $"/company/invoices/document/{invoiceId}";
            var shortCode = await urlShortener.GenerateAndSaveUniqueCode(
                url: invoiceUrl);
            
            var contact = await contactReader.GetSingleByIdAsync(invoice.ContactId);
            if (contact == null)
            {
                throw new Exception($"Could not find contact with id {invoice.ContactId} to send invoice to.");
            }
            // var phoneNumber = contact.ContactAddresses?.FirstOrDefault(a => a.AddressType == ContactAddressTypes.PhoneNumber)?.Value;
            // await whatsAppSender.SendAsync(
            //     phoneNumber: "+254721553229",
            //         templateSid: WhatsAppSender.InvoiceDueTemplateSid,
            //         variables: new Dictionary<string, string>
            //         {
            //             { "first_name", contact.DisplayLabel },
            //             { "short_code", shortCode },
            //             { "invoice_number", invoice.InvoiceNumberPadded },
            //             { "amount", invoice.Balance.ToString("N2") },
            //             { "biller", invoice.CompanyDisplayLabel },
            //             { "days", "7" }
            //         }
            //     );
            return true;
        }
    }
}