import { PureComponent } from "react";
import ErrorLogFileLogic from "../State/ErrorLogFileLogic";
import FrostedGlassOverlay from "@/FrostedGlassOverlay/UI/FrostedGlassOverlay";
import SelectPrimitive from "@/Forms/SelectWrapper/UI/SelectPrimitive";
import ArSh from "@/ArSh/ArSh";
import DefaultLayout from "@/layouts/ui/DefaultLayout";
import { Form } from "@/Forms/Form/UI/Form";
import { IStackFrame } from "../Data/IStackFrame";
import { IEvent } from "../Data/IEvent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faCode,
  faFile,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../Styles/LogViewer.module.css";
import HorizontalDivider from "@/Forms/Divider/UI/HorizontalDivider";
import { WebShellButton } from "jattac.libs.webshell";

const logic = new ErrorLogFileLogic();

interface ILogViewerProps {}

export default class LogViewer extends PureComponent<ILogViewerProps> {
  async componentDidMount(): Promise<void> {
    logic.setRerender(() => this.forceUpdate());
    await logic.initializeAsync();
  }

  private renderStackFrame(frame: IStackFrame) {
    return (
      <div className={styles.stackFrame}>
        <div className={styles.method}>
          <FontAwesomeIcon icon={faCode} className={styles.icon} />
          {frame.methodName}
        </div>
        <div className={styles.file}>
          <FontAwesomeIcon icon={faFile} className={styles.icon} />
          {frame.fileName}:{frame.lineNumber}
        </div>
      </div>
    );
  }
  private openChatGPTSearch = (query: string) => {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://chat.openai.com/?q=${encodedQuery}`;
    window.open(url, "_blank");
  };

  private renderEvent(event: IEvent) {
    return (
      <div className={`${styles.beautifulCard} ${styles.event}`}>
        <div className={styles.header}>
          <div className={styles.type}>{event.exceptionType}</div>
          <div className={styles.date}>
            <FontAwesomeIcon icon={faCalendarAlt} className={styles.icon} />
            {new Date(event.exceptionDateUtc).toLocaleString()}
          </div>
        </div>
        <div className={styles.message}>{event.message}</div>
        <div className={styles.user}>{event.user}</div>
        <HorizontalDivider />
        {event.description && (
          <div className={styles.description}>{event.description}</div>
        )}
        {event.extraInformation && (
          <div className={styles.info}>
            <FontAwesomeIcon icon={faInfoCircle} className={styles.icon} />
            {event.extraInformation}
          </div>
        )}
        {event.frames && event.frames.length > 0 && (
          <div className={styles.frames}>
            {event.frames.map((frame, index) => (
              <div key={index}>{this.renderStackFrame(frame)}</div>
            ))}
            <HorizontalDivider />
          </div>
        )}
        <WebShellButton
          onClick={() =>
            this.openChatGPTSearch(`${event.exceptionType} ${event.message}`)
          }
          buttonType="neutral"
        >
          Get Help
        </WebShellButton>
        <HorizontalDivider />
      </div>
    );
  }

  private renderLogContent() {
    const selectedLog = logic.repository.selectedLog;
    const exceptionEvents = logic.exceptionEvents;

    if (!selectedLog) {
      return null;
    }

    if (exceptionEvents.length > 0) {
      return (
        <div className={styles.container}>
          <div className={styles.content}>
            {exceptionEvents.map((exceptionEvent, index) => {
              return (
                <div key={index} className={styles.exception}>
                  {this.renderEvent(exceptionEvent.event)}
                </div>
              );
            })}

            {/* {Array.from(exceptionEvents.entries()).map(([type, exceptions], groupIndex) => (
              <div key={groupIndex} className={styles.exceptionGroup}>
                <div className={styles.groupHeader}>
                  <FontAwesomeIcon 
                    icon={faExclamationCircle} 
                    className={styles.icon} 
                    color="var(--error)" 
                  />
                  <span className={styles.groupTitle}>{type}</span>
                  <span className={styles.groupCount}>
                    {exceptions.length} occurrence{exceptions.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {exceptions.map((exceptionEvent, index) => (
                  <div key={index} className={styles.exception}>
                    {this.renderEvent(exceptionEvent.event, index === 0)}
                  </div>
                ))}
              </div>
            ))} */}
          </div>
        </div>
      );
    }

    // Display as raw log content
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <pre className={styles.rawContent}>{selectedLog.content}</pre>
        </div>
      </div>
    );
  }

  private renderFileSelector() {
    const availableLogs = logic.repository.availableLogs;

    return (
      <div className={styles.select}>
        <SelectPrimitive
          placeholder="Select a log file..."
          items={availableLogs.map(
            (log) =>
              `${log.fileName} (${new Date(log.fileDate).toLocaleDateString()})`
          )}
          onChange={async (items) => {
            if (ArSh.isEmpty(items)) {
              logic.clearSelectedLog();
            } else {
              const fileName = items[0].split(" (")[0];
              await logic.loadLogContentAsync({ fileName });
            }
          }}
          selectedResolver={(candidate) => {
            const fileName = candidate.split(" (")[0];
            return fileName === logic.repository.selectedLog?.fileName;
          }}
          autoFocus={true}
          menuPortalTarget={document.body}
        />
      </div>
    );
  }

  render() {
    return (
      <DefaultLayout title="Log Viewer">
        <FrostedGlassOverlay show={logic.repository.busy}>
          <Form>
            {this.renderFileSelector()}
            <div className={styles.scrollable}>{this.renderLogContent()}</div>
          </Form>
        </FrostedGlassOverlay>
      </DefaultLayout>
    );
  }
}
