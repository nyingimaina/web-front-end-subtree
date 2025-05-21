using System.Net;
using System.Text.Json;

namespace Jattac.Apps.CompanyMan.ExceptionHandlingMiddleware
{
    public class CustomExceptionHandlerMiddleWare
    {
        private readonly RequestDelegate _next;

        public CustomExceptionHandlerMiddleWare(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                Program.ErrorLogger.Log(ex);
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            // Define the response based on the exception type
            var response = exception is ClientVisibleInformationException clientVisibleEx
                ? new ClientResponse { Message = clientVisibleEx.Message, IsError = true }
                : new ClientResponse { Message = "An error occurred. Please try again later.", IsError = true };

            // Serialize and write the response
            return WriteJsonResponseAsync(context, response);
        }

        // Helper method to serialize the response and write it to the context
        private static Task WriteJsonResponseAsync(HttpContext context, ClientResponse response)
        {
            var jsonResponse = JsonSerializer.Serialize(response);
            return context.Response.WriteAsync(jsonResponse);
        }
    }
}
