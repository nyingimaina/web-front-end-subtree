namespace Jattac.Apps.CompanyMan.Profiling
{
    public static class ExecutionTimeProxyExtensions
    {
        private static bool? profilingEnabled;

        public static bool ProfilingEnabled
        {
            get
            {
                if (profilingEnabled == null)
                {
                    if (IsProduction())
                    {
                        return false;
                    }
                    else
                    {
                        return true;
                    }
                }
                else
                {
                    return profilingEnabled.Value;
                }
            }   

            set => profilingEnabled = value; 
        }
        public static IServiceCollection ProfileScoped<TInterface, TImplementation>(
            this IServiceCollection services
        )
            where TImplementation : class, TInterface
            where TInterface : class
        {
            if (ProfilingEnabled == false)
            {
                return services
                    .AddScoped<TInterface, TImplementation>();
            }

            return services
                    .AddScoped<TImplementation>()
                    .AddScoped(provider =>
                    {
                        var implementation = provider.GetRequiredService<TImplementation>();
                        var proxy = ExecutionTimeProxy<TInterface>.Create(implementation);
                        return proxy;
                    });
        }

        public static bool IsProduction()
        {
            string env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? Environments.Production;
            return env == Environments.Production;
        }
    }
}