import { IErrorLogContent } from "../Data/IErrorLogContent";
import { IErrorLogFile } from "../Data/IErrorLogFile";
import RepositoryBase from "@/State/RepositoryBase";

/**
 * Repository for managing error log file state.
 * Follows the standard repository pattern for state management.
 * Only handles read operations since error logs are managed externally.
 */
export default class ErrorLogFileRepository extends RepositoryBase {
  public selectedLog?: IErrorLogContent;
  public availableLogs: IErrorLogFile[] = [];
}
