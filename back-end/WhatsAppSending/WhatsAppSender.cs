using System.Text.Json;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace Jattac.Apps.CompanyMan.WhatsAppSending
{
    public interface IWhatsAppSender
    {
        Task SendAsync(
            string phoneNumber,
            string templateSid,
            Dictionary<string, string> variables);
    }
    public class WhatsAppSender : IWhatsAppSender
    {
        public const string InvoiceDueTemplateSid = "HXf860704e50efe2e6439b997b672a88fb";
        public async Task SendAsync(
            string phoneNumber,
            string templateSid,
            Dictionary<string, string> variables)
        {
            var accountSid = "ACf17c0e67240ba3cd3041d816126e474f";
            var authToken = "920bfaa6182d2dfb4d5c1e45f8009a1a";


            // var toWhatsAppNumber = new PhoneNumber($"whatsapp:{phoneNumber}"); // your phone
            // var fromWhatsAppNumber = new PhoneNumber("whatsapp:+14155238886");

            TwilioClient.Init(accountSid, authToken);

            var messageOptions = new CreateMessageOptions(
              new PhoneNumber($"whatsapp:{phoneNumber}"));
            messageOptions.From = new PhoneNumber("whatsapp:+15557127490");
            messageOptions.ContentSid = templateSid;
            messageOptions.ContentVariables = JsonSerializer.Serialize(variables);

            var failureStatuses = new HashSet<MessageResource.StatusEnum>
            {
                MessageResource.StatusEnum.Canceled,
                MessageResource.StatusEnum.Failed,
                MessageResource.StatusEnum.Undelivered
            };

            var message = await MessageResource.CreateAsync(messageOptions);
            if (message == null)
            {
                throw new Exception("Failed to send message");
            }
            else if (failureStatuses.Contains(message.Status))
            {
                throw new Exception($"Failed to send message. Status is {message.Status}\n\n{message.ErrorMessage}");
            }



            // var message = MessageResource.Create(
            //     body: $"Your charges for this month are due.\n\n" +
            //          $"Kindly pay within 7 days to avoid service suspension.\n\n"
            //          + $"See your invoice here: http://localhost:3000/fast?code={variables[1]}",
            //     from: fromWhatsAppNumber,
            //     to: toWhatsAppNumber);
        }
    }
}