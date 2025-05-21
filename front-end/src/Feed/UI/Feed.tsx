import React from "react";
import styles from "../Styles/Feed.module.css";
import FeedItem from "@/FeedItems/UI/FeedItem";
import Card from "@/Forms/Card/UI/Card";
import FeedLogic from "../State/FeedLogic";

const logic = new FeedLogic();
class Feed extends React.Component {
  handlePositiveAction = (id: string) => {
    console.log(`Approved item ${id}`);
  };

  handleNegativeAction = (id: string) => {
    console.log(`Rejected item ${id}`);
  };

  async componentDidMount() {
    logic.setRerender(() => this.forceUpdate());
    await logic.initializeAsync();
  }

  render() {
    if (
      !logic.repository.feedItems ||
      !Array.isArray(logic.repository.feedItems) ||
      logic.repository.feedItems.length < 1
    ) {
      return null;
    }
    return (
      <Card title="For Your Attention">
        <div className={styles.feed}>
          {logic.repository.feedItems.map((item) => (
            <FeedItem
              feedItem={item}
              key={item.id}
              onPositiveAction={() => {
                if (
                  item.name.toLocaleLowerCase() ===
                  "TelexReleaseRequest".toLocaleLowerCase()
                ) {
                  window.location.href = "/customers/telex-release-request";
                }
              }}
              // onNegativeAction={() => this.handleNegativeAction(item.id)}
            />
          ))}
        </div>
      </Card>
    );
  }
}

export default Feed;
