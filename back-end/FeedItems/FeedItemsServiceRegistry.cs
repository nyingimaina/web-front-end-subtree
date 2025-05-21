namespace Jattac.Apps.CompanyMan.FeedItems
{
    public static class FeedItemsServiceRegistry
    {
        public static IServiceCollection RegisterFeedItemsServices(
            this IServiceCollection services
        )
        {
            return services
                .AddScoped<IFeedItemReader, FeedItemReader>()
                .AddScoped<IFeedItemsWriter, FeedItemsWriter>();
        }
    }
}