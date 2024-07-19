export interface TrackEntry {
  topic: Topic;
  startTime: Date;
}

export interface Topic {
  name: string;
  createdAt: number;
}

export interface Title {
  id: string;
  name: string;
}
