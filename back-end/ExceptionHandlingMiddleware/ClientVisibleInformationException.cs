namespace Jattac.Apps.CompanyMan.ExceptionHandlingMiddleware
{
    public class ClientVisibleInformationException : Exception
    {
        public ClientVisibleInformationException(string message) : base(message)
        {}
    }
}