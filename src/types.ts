export interface TrackEntry {
  topicName: string;
  startTime: number;
  endTime: number | null;
}

export interface Topic {
  name: string;
  createdAt: number;
}

export interface Title {
  id: string;
  name: string;
}
