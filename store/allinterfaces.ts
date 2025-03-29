export interface VideoAssets {
  userId: string;
  captions: {
    firstScene: CaptionResult;
    dialogs: Record<string, CaptionResult>;
    lastScene: CaptionResult;
  };
  audioUrls: {
    firstScene: string;
    dialogs: Array<{ sceneName: string; audioUrl: string }>;
    lastScene: string;
  };
  imageUrls: {
    firstScene: string;
    scenes: string[];
    lastScene: string;
  };
  content: string;
  totalDuration: number;
}

export interface CaptionResult {
  words: Array<{ word: string; start: number; end: number }>;
  startTime: number;
  endTime: number;
}
