using Jattac.Apps.CompanyMan;
using Jattac.Apps.CompanyMan.Echos;
using Jattac.Apps.CompanyMan.Routing;
using jattac.libs.logger;
using jattac.libs.logger.LogTargets;
using Rocket.Libraries.DatabaseIntegrator;
using Rocket.Libraries.Auth;
using Jattac.Apps.CompanyMan.Security.Jwt;
using Dapper;
using Jattac.Apps.CompanyMan.Database.TypeHandlers;
using Jattac.Apps.CompanyMan.Setup;
using Jattac.Apps.CompanyMan.JsonSerialization;
using Jattac.Apps.CompanyMan.HttpHeaders;
using Jattac.Apps.CompanyMan.AppSetting;

AppDomain.CurrentDomain.UnhandledException += (sender, args) =>
{
    var exception = args.ExceptionObject as Exception;
    if (exception != null)
    {
        ErrorLogger.Log(exception);
    }
};

TaskScheduler.UnobservedTaskException += (sender, args) =>
{
    var exception = args.Exception;
    if (exception != null)
    {
        ErrorLogger.Log(exception);
    }
    args.SetObserved(); 
};

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<AppSettings>(
    builder.Configuration);

// Add services to the container
builder.Services.AddHttpContextAccessor();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.RegisterServices();

builder.WebHost.UseKestrel(options =>
{
    options.ListenAnyIP(5136);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()    
               .AllowAnyHeader()    
               .AllowAnyMethod()
               .WithExposedHeaders("Content-Disposition"); 
    });
});

builder.Services.AddControllers();

builder.Services.Configure<DatabaseConnectionSettings>(builder.Configuration.GetSection("DatabaseConnectionSettings"));
builder.Services.InitializeDatabaseIntegrator<Guid,DatabaseConnectionProvider>();
builder.Services.SetupRocketJwtAuth<ConsulSecretProvider>();
builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
{
    options.SerializerOptions.Converters.Add(new DateTimeConverter());
});

var app = builder.Build();
app.ConfigureMiddleware();

await InitializeAppAsync(app);

// Configure the HTTP request pipeline.


app.RegisterEchoEndpoints()
    .RegisterCustomRoutes();

ErrorLogger = new ErrorLogger(
    targets: new HashSet<IErrorLogTarget>
    {
        DiskErrorLogTarget,
        new ConsoleErrorTarget(),
    },
    userResolver: async () =>
    {
        using (var scope = app.Services.CreateScope())
        {
            var services = scope.ServiceProvider;
            var standardHeaderReader = services.GetRequiredService<IStandardHeaderReader>();
            try
            {
                return await Task.FromResult(standardHeaderReader.SignedInUsername);
            }
            catch
            {
                return await Task.FromResult("Unknown");
            }
        }
    });

SqlMapper.AddTypeHandler(new HashSetTypeHandler());

app.Run();

public partial class Program
{
    public static DiskErrorLogTarget DiskErrorLogTarget { get; private set; } = new DiskErrorLogTarget();
    public static ErrorLogger ErrorLogger { get; private set; } = default!;

    public static async Task InitializeAppAsync(WebApplication app)
    {
        using(var scope = app.Services.CreateScope())
        {
            var selfSetupService = scope.ServiceProvider.GetRequiredService<ISelfSetupService>();
            await selfSetupService.SetupIfRequiredAsync();
        }
    }
}