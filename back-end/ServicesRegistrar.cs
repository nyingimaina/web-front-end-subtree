using Jattac.Apps.CompanyMan.DocumentGeneration;
using Jattac.Apps.CompanyMan.FilesAndDocuments.PdfGeneration;
using Jattac.Apps.CompanyMan.FilesAndDocuments.Templates;
using Jattac.Apps.CompanyMan.Security.Authentication;
using Jattac.Apps.CompanyMan.Security.Users;
using Jattac.Apps.CompanyMan.Security.Permissions;
using Jattac.Apps.CompanyMan.Security.Companies;
using Jattac.Apps.CompanyMan.HttpHeaders;
using Jattac.Apps.CompanyMan.Security.Roles;
using Jattac.Apps.CompanyMan.Setup;
using Jattac.Apps.CompanyMan.Security.UserRoles;
using Jattac.Apps.CompanyMan.Security.RolePermissions;
using Jattac.Apps.CompanyMan.Security.UserPermissions;
using Jattac.Apps.CompanyMan.FeedItems;
using Jattac.Apps.CompanyMan.FeedItemsUsers;
using Jattac.Apps.CompanyMan.CompanyIncrementalNumbers;
using Rocket.Libraries.DatabaseIntegrator;
using auto_dial;
using Jattac.Apps.CompanyMan.BackgroundTasks;
using Jattac.Apps.CompanyMan.ErrorLogFiles;
using Jattac.Apps.CompanyMan.ViewInvoiceRepetitionTracking;

namespace Jattac.Apps.CompanyMan
{
    public static class ServicesRegistrar
    {
        public static IServiceCollection RegisterServices(this IServiceCollection services)
        {
            services
                .AddScoped<IErrorLogFileService, ErrorLogFileService>()
                .AddSingleton<IBackgroundTaskQueue, BackgroundTaskQueue>()
                .AddScoped<IRecurringInvoiceGenerator, RecurringInvoiceGenerator>()
                .AddHostedService<QueuedBackgroundService>()
                .RegisterDocumentGenerationServices()
                .RegisterPdfGenerationServices()
                .RegisterTemplateServices()
                .RegisterAuthenticationServices()
                .RegisterUserServices()
                .RegisterPermissionsServices()
                .RegisterCompanyServices()
                .AddScoped<IHeaderReader, HeaderReader>()
                .AddScoped<IStandardHeaderReader, StandardHeaderReader>()
                .RegisterRoleServices()
                .AddScoped<ISelfSetupService, SelfSetupService>()
                .RegisterUserRoleServices()
                .RegisterRolePermissionsServices()
                .AddScoped<IUserPermissionChecker, UserPermissionChecker>()
                .RegisterFeedItemsServices()
                .RegisterFeedItemsUserServices()
                .RegisterCompanyIncrementalNumberServices()
                .PrimeServicesForAutoRegistration()
                .FromAssemblyOf<Program>()
                .InNamespaceStartingWith("Jattac.Apps.CompanyMan")
                .ExcludeInterfaces(typeof(IReaderBase<,>), typeof(IWriterBase<,>), typeof(IDatabaseReaderBase<>), typeof(IDatabaseWriterBase<>))
                .CompleteAutoRegistration();
                

            return services;
        }
    }
}