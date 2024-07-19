import { ActionPanel, showToast, Toast, Action, List, Icon } from "@raycast/api";
import { getTopics, deleteTopic, isTopicBeingTracked } from "./storage";
import { useEffect, useState } from "react";
import { Topic } from "./types";

export default function Command() {
  const [topics, setTopics] = useState<Topic[] | null>(null);

  function handleDelete(topicToDelete: Topic) {
    console.log(topicToDelete);

    if (topics === null) {
      showToast(Toast.Style.Failure, "Error parsing topics", "Please create a topic");
      return;
    }

    const isBeingTracked = isTopicBeingTracked(topicToDelete);
    if (isBeingTracked) {
      showToast(Toast.Style.Failure, "Topic is being tracked", "Please stop tracking the topic before deleting it");
      return;
    }

    const deleted = deleteTopic(topicToDelete);
    if (!deleted) showToast(Toast.Style.Failure, "Error deleting topic", "Please try again");
    else showToast(Toast.Style.Success, "Deleted topic", `Topic: ${topicToDelete.name}`);

    if (deleted) {
      const newTopics = topics.filter((topic) => topic.name !== topicToDelete.name);
      setTopics(newTopics);
    }
  }

  useEffect(() => {
    let topics = getTopics();
    if (topics === null) {
      showToast(Toast.Style.Failure, "Error parsing topics", "Please create a topic");
      return;
    }
    setTopics(topics);
  }, []);

  return (
    <List isLoading={!topics}>
      {topics?.map((item, index) => (
        <TopicListItem key={item.name} item={item} index={index} handleDelete={handleDelete} />
      ))}
    </List>
  );
}

function TopicListItem(props: { item: Topic; index: number; handleDelete: (topic: Topic) => void }) {
  return (
    <List.Item
      key={props.item.name}
      title={props.item.name}
      actions={<Actions item={props.item} handleDelete={() => props.handleDelete(props.item)} />}
    />
  );
}

function Actions(props: { item: Topic; handleDelete: () => void }) {
  return (
    <ActionPanel title={props.item.name}>
      <ActionPanel.Section>
        {props.item.name && (
          <Action
            title="Delete topic"
            onAction={props.handleDelete}
            icon={Icon.Minus}
            style={Action.Style.Destructive}
          />
        )}
      </ActionPanel.Section>
    </ActionPanel>
  );
}
