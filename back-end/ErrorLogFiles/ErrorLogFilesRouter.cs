using Jattac.Apps.CompanyMan.ErrorLogFiles.Data;
using Jattac.Apps.CompanyMan.Routing;

namespace Jattac.Apps.CompanyMan.ErrorLogFiles
{
    public class ErrorLogFilesRouter : CompanyManRouter
    {
        private readonly IErrorLogFileService _service;

        public ErrorLogFilesRouter(IErrorLogFileService service)
        {
            _service = service;
        }

        public override string RouteName => "error-logs";

        public override HashSet<RouteDescription> RouteDescriptions => new()
        {
            new("list", HttpMethod.Get, GetAvailableLogFilesAsync, false, 
                "Get list of available error log files",
                "Returns a list of error log files with their dates and sizes",
                typeof(List<ErrorLogFile>), null),
            new("content", HttpMethod.Get, GetLogFileContentAsync, false,
                "Get content of a specific error log file",
                "Returns the content of the requested error log file",
                typeof(ErrorLogContent), typeof(string))
        };

        private async Task<IResult> GetAvailableLogFilesAsync()
        {
            var files = await _service.GetAvailableLogFilesAsync();
            return Results.Ok(files);
        }

        private async Task<IResult> GetLogFileContentAsync(string fileName)
        {
            var content = await _service.GetLogFileContentAsync(fileName);
            if (content == null)
            {
                return Results.NotFound($"Log file '{fileName}' not found");
            }
            return Results.Ok(content);
        }
    }
}
