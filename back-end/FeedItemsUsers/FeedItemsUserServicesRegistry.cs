namespace Jattac.Apps.CompanyMan.FeedItemsUsers
{
    public static class FeedItemsUserServicesRegistry
    {
        public static IServiceCollection RegisterFeedItemsUserServices(
            this IServiceCollection services
        )
        {
            return services
                .AddScoped<IFeedItemsUserReader, FeedItemsUserReader>()
                .AddScoped<IFeedItemsUserWriter, FeedItemsUserWriter>();
        }
    }
}