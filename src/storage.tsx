import { Topic, TrackEntry } from "./types";
import { environment } from "@raycast/api";

import fs from "fs";

const SUPPORT_PATH = environment.supportPath;
const TOPICS_PATH = `${SUPPORT_PATH}/topics.json`;

const trackEntryPath = (topic: Topic) => `${SUPPORT_PATH}/${topic.name}.json`;
const entriesPath = (topic: Topic) => `${SUPPORT_PATH}/entries_${topic.name}.json`;

export function getTopics(): Topic[] | null {
  try {
    const contents = fs.readFileSync(TOPICS_PATH);
    const topics = JSON.parse(contents.toString());
    return topics;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export function getTopic(topicName: string): Topic | null {
  const topics = getTopics();
  if (topics === null) {
    return null;
  }

  const topic = topics.find((t) => t.name === topicName);

  if (topic === undefined) {
    return null;
  }

  return topic;
}

export function getTrackEntry(topic: Topic): TrackEntry | null {
  try {
    if (!fs.existsSync(trackEntryPath(topic))) {
      return null;
    }

    const contents = fs.readFileSync(trackEntryPath(topic));
    const entry = JSON.parse(contents.toString());
    return entry;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export function isTopicBeingTracked(topic: Topic): boolean {
  return fs.existsSync(trackEntryPath(topic));
}

export function stopTrackEntry(topic: Topic): boolean {
  try {
    const entryPath = trackEntryPath(topic);
    let entries = [];
    let entry = null;

    let contents = fs.readFileSync(entryPath);
    entry = JSON.parse(contents.toString());
    entry.endTime = Date.now();

    if (fs.existsSync(entriesPath(topic))) {
      contents = fs.readFileSync(entriesPath(topic));
      entries = JSON.parse(contents.toString());
    }
    entries.push(entry);

    fs.writeFileSync(entriesPath(topic), JSON.stringify(entries));
    fs.unlinkSync(entryPath);

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export function startTrackEntry(topic: Topic): boolean {
  try {
    const startTime = Date.now();
    const entry = {
      topic: topic.name,
      startTime,
    };

    fs.writeFileSync(trackEntryPath(topic), JSON.stringify(entry));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export function deleteTopic(topic: Topic): boolean {
  try {
    const topics = getTopics();
    if (topics === null) {
      return false;
    }

    const newTopics = topics.filter((t) => t.name !== topic.name);
    fs.writeFileSync(TOPICS_PATH, JSON.stringify(newTopics));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export function addTopic(topic: Topic): boolean {
  try {
    const topics = getTopics();
    if (topics === null) {
      return false;
    }

    topics.push(topic);
    fs.writeFileSync(TOPICS_PATH, JSON.stringify(topics));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
