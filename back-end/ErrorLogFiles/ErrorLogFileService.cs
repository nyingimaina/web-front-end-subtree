using Jattac.Apps.CompanyMan.ErrorLogFiles.Data;
using System.Text.Json;

namespace Jattac.Apps.CompanyMan.ErrorLogFiles
{
    public interface IErrorLogFileService
    {
        Task<List<ErrorLogFile>> GetAvailableLogFilesAsync();
        Task<ErrorLogContent?> GetLogFileContentAsync(string fileName);
    }

    public class ErrorLogFileService : IErrorLogFileService
    {
        private readonly string _errorLogsPath;

        public ErrorLogFileService()
        {
            var assemblyLocation = typeof(ErrorLogFileService).Assembly.Location;
            var assemblyDir = Path.GetDirectoryName(assemblyLocation)!;
            var projectRoot = Path.GetFullPath(Path.Combine(assemblyDir, "..", "..", ".."));

            // First try project root for debug environment
            var debugPath = Path.Combine(projectRoot, "ErrorLogs");
            if (Directory.Exists(debugPath))
            {
                _errorLogsPath = debugPath;
                return;
            }

            // Fallback to executing assembly location for production
            _errorLogsPath = Path.Combine(assemblyDir, "ErrorLogs");
        }

        public async Task<List<ErrorLogFile>> GetAvailableLogFilesAsync()
        {
            if (!Directory.Exists(_errorLogsPath))
            {
                return new List<ErrorLogFile>();
            }

            return await Task.Run(() =>
            {
                var files = Directory.GetFiles(_errorLogsPath, "*.log")
                    .Select(filePath =>
                    {
                        var fileInfo = new FileInfo(filePath);
                        var content = File.ReadAllText(filePath);
                        var events = JsonSerializer.Deserialize<List<ExceptionEvent>>(content);
                        var firstEvent = events?.FirstOrDefault()?.Event;
                        
                        return new ErrorLogFile
                        {
                            FileName = fileInfo.Name,
                            FileDate = firstEvent?.ExceptionDateUtc ?? fileInfo.CreationTime,
                            FileSizeBytes = fileInfo.Length
                        };
                    })
                    .OrderByDescending(f => f.FileDate)
                    .ToList();

                return files;
            });
        }

        public async Task<ErrorLogContent?> GetLogFileContentAsync(string fileName)
        {
            var filePath = Path.Combine(_errorLogsPath, fileName);
            
            // Security check: Ensure the requested file is within the ErrorLogs directory
            var fullPath = Path.GetFullPath(filePath);
            if (!fullPath.StartsWith(Path.GetFullPath(_errorLogsPath), StringComparison.OrdinalIgnoreCase))
            {
                return null;
            }

            if (!File.Exists(filePath))
            {
                return null;
            }

            var content = await File.ReadAllTextAsync(filePath);
            return new ErrorLogContent
            {
                FileName = fileName,
                Content = content
            };
        }
    }
}
