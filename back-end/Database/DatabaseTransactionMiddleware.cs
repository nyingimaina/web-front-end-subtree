using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.Database
{
    public class DatabaseTransactionMiddleware
    {
        private readonly RequestDelegate next;

        public DatabaseTransactionMiddleware(
            RequestDelegate next
        )
        {
            this.next = next;
        }

        public async Task InvokeAsync(
            HttpContext context,
            IDatabaseHelper<Guid> databaseHelper)
        {
            try
            {
                databaseHelper.BeginTransaction();
                await next(context);
                databaseHelper.CommitTransaction();
            }
            catch
            {
                databaseHelper.RollBackTransaction();
                throw;
            }
        }
    }
}