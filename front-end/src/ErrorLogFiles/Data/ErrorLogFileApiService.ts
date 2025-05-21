import ApiServiceBase from "@/ApiService/ApiServiceBase";
import { IErrorLogContent } from "./IErrorLogContent";
import { IErrorLogFile } from "./IErrorLogFile";

/**
 * API service for reading error log files from the ErrorLogs directory.
 * This service is read-only and does not manage or create log files.
 * Log files are generated independently by other parts of the system.
 * 
 * File naming pattern: ErrorLog_YYYYMMDD.log
 * Example: ErrorLog_20250313.log
 * 
 * Directory resolution:
 * 1. Debug: <ProjectRoot>/ErrorLogs/
 * 2. Production: <AssemblyDir>/ErrorLogs/
 */
export default class ErrorLogFileApiService extends ApiServiceBase {
  protected route = "error-logs";

  /**
   * Gets a list of available error log files from the ErrorLogs directory.
   * Files are ordered by date descending (newest first).
   * 
   * @returns Promise resolving to an array of IErrorLogFile containing:
   *  - fileName: Name of the log file (format: ErrorLog_YYYYMMDD.log)
   *  - fileDate: Date from first exception event, or file creation time if no events
   *  - fileSizeBytes: Size of the log file in bytes
   * @throws Error if:
   *  - ErrorLogs directory does not exist
   *  - Request fails or returns an error response
   */
  public async getAvailableLogFilesAsync(): Promise<IErrorLogFile[]> {
    return await this.getOrThrowAsync<IErrorLogFile[]>({
      endpoint: "list",
    });
  }

  /**
   * Gets the content of a specific error log file.
   * The content may be either:
   * 1. Structured log (JSON array of IExceptionEvent)
   * 2. Raw log content (plain text)
   * 
   * Security:
   * - Path traversal is prevented by validating file name format
   * - File access is restricted to ErrorLogs directory
   * 
   * @param args.fileName - Name of the log file to retrieve (format: ErrorLog_YYYYMMDD.log)
   * @returns Promise resolving to IErrorLogContent containing:
   *  - fileName: Name of the log file
   *  - content: Raw content of the log file
   * @throws Error if:
   *  - File is not found
   *  - File name format is invalid
   *  - File is outside ErrorLogs directory
   *  - Request fails or returns an error response
   */
  public async getLogFileContentAsync(args: {
    fileName: string;
  }): Promise<IErrorLogContent> {
    // Validate file name format
    if (!args.fileName.match(/^ErrorLog_\d{8}\.log$/)) {
      throw new Error("Invalid log file name format. Expected: ErrorLog_YYYYMMDD.log");
    }

    // Prevent directory traversal
    if (args.fileName.includes("/") || args.fileName.includes("\\")) {
      throw new Error("Invalid file name: must not contain path separators");
    }

    const result = await this.getOrThrowAsync<IErrorLogContent>({
      endpoint: "content",
      queryParams: {
        fileName: args.fileName,
      },
    });

    if (!result) {
      throw new Error(`Log file '${args.fileName}' not found`);
    }

    return result;
  }
}
