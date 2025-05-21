import React from "react";
import styles from "../Styles/FeedItem.module.css";
import IFeedItem from "../Data/IFeedItem";
import TimeAgo from "timeago-react";

interface IProps {
  feedItem: IFeedItem;
  onPositiveAction: () => void;
  onNegativeAction?: () => void;
}

class FeedItem extends React.Component<IProps> {
  render() {
    const { feedItem, onPositiveAction, onNegativeAction } = this.props;
    const { title, description, created: timestamp, dueOn } = feedItem;

    return (
      <div className={styles.feedItem}>
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: description }}
          />
          <div className={styles.meta}>
            <span className={styles.timestamp}>
              <TimeAgo datetime={timestamp} />
            </span>
            {dueOn && (
              <span className={styles.dueOn}>
                Due: <TimeAgo datetime={dueOn} />
              </span>
            )}
          </div>
        </div>
        <div className={styles.actions}>
          <button className={styles.positiveAction} onClick={onPositiveAction}>
            More
          </button>
          {onNegativeAction && (
            <button
              className={styles.negativeAction}
              onClick={onNegativeAction}
            >
              Reject
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default FeedItem;
