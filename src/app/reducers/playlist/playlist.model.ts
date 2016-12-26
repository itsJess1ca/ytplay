export type LoopMode = 'all' | 'one' | 'off';
export interface Song {
  title: string;
  videoId: VideoID;
  channel: string;
  channelLink: string;
  active: boolean;
}
