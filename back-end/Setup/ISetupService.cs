namespace Jattac.Apps.CompanyMan.Setup
{
    public interface ISetupService
    {
        /// <summary>
        /// Executes a custom series of commands required of it to move the system to 
        /// a known initial state. Should anything fail, the service should throw an exception.
        /// </summary>
        /// <remarks>Throws exception on failure, but on success just silently returns</remarks>
        Task ExecuteAsync();
    }
}