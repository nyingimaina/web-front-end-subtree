import LogicBase from "@/State/LogicBase";
import { IErrorLogContent } from "../Data/IErrorLogContent";
import { IErrorLogFile } from "../Data/IErrorLogFile";
import ErrorLogFileRepository from "./ErrorLogFileRepository";
import ErrorLogFileApiService from "../Data/ErrorLogFileApiService";
import { IExceptionEvent } from "../Data/IExceptionEvent";

/**
 * Business logic for error log file management.
 * Follows the standard logic pattern for business rules.
 * Only handles read operations since error logs are managed externally.
 */
export default class ErrorLogFileLogic extends LogicBase<ErrorLogFileRepository> {
  private service = new ErrorLogFileApiService();
  protected get modelTemplate(): {} {
    throw new Error("Method not implemented.");
  }
  model = {};
  public repository = new ErrorLogFileRepository();

  /**
   * Initializes the logic by loading available log files.
   * Should be called when the component mounts.
   *
   * @throws Error if:
   *  - ErrorLogs directory does not exist
   *  - Request fails or returns an error response
   */
  public async initializeAsync(): Promise<void> {
    try {
      await this.loadAvailableLogsAsync();
    } catch (error) {
      throw new Error(`Failed to initialize error log files\n${error}`);
    }
  }

  /**
   * Loads available error log files from the ErrorLogs directory.
   * Updates repository state with the list of files.
   *
   * @throws Error if:
   *  - ErrorLogs directory does not exist
   *  - Request fails or returns an error response
   */
  private async loadAvailableLogsAsync(): Promise<void> {
    await this.proxyRunner.runAsync(async () => {
      this.updateRepository({
        availableLogs: await this.service.getAvailableLogFilesAsync(),
      });
    });
  }

  /**
   * Loads content of a specific error log file.
   * Updates repository state with the file content.
   *
   * @param args.fileName - Name of the log file to load (format: ErrorLog_YYYYMMDD.log)
   * @throws Error if:
   *  - File is not found
   *  - File name format is invalid
   *  - File is outside ErrorLogs directory
   *  - Request fails or returns an error response
   */
  public async loadLogContentAsync(args: { fileName: string }): Promise<void> {
    await this.proxyRunner.runAsync(async () => {
      this.updateRepository({
        selectedLog: await this.service.getLogFileContentAsync(args),
      });
    });
  }

  /**
   * Clears the currently selected log file.
   * Updates repository state and triggers UI rerender.
   */
  public clearSelectedLog(): void {
    this.repository.selectedLog = undefined;
    this.rerender();
  }

  /**
   * Gets the currently selected log file content.
   * @returns IErrorLogContent if a log is selected, undefined otherwise
   */
  public getSelectedLog(): IErrorLogContent | undefined {
    return this.repository.selectedLog;
  }

  /**
   * Gets the list of available log files.
   * @returns Array of IErrorLogFile containing metadata about each log file
   */
  public getAvailableLogs(): IErrorLogFile[] {
    return this.repository.availableLogs;
  }

  public get exceptionEvents(): IExceptionEvent[] {
    if (this.repository.selectedLog) {
      const exceptionEventsPascalCase = JSON.parse(
        this.repository.selectedLog.content
      ) as IExceptionEvent[];
      const exceptionEventsCamelCase = this.convertKeysToCamelCase(
        exceptionEventsPascalCase
      );
      return exceptionEventsCamelCase;
    }
    return [];
  }

  private toCamelCase = (str: string) =>
    str.charAt(0).toLowerCase() + str.slice(1);

  private convertKeysToCamelCase = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.convertKeysToCamelCase(item));
    } else if (obj !== null && typeof obj === "object") {
      return Object.keys(obj).reduce((acc, key) => {
        const camelKey = this.toCamelCase(key);
        acc[camelKey] = this.convertKeysToCamelCase(obj[key]);
        return acc;
      }, {} as any);
    }
    return obj;
  };
}
