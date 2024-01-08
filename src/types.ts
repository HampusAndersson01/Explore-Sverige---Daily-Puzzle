export interface Landmark {
  swedish: string;
  english: string;
  latitude: number;
  longitude: number;
}

export interface LandmarksData {
  landmarks: Landmark[];
}

export interface Feedback {
  swedish: string;
  english: string;
  score: number;
  distance: number;
  direction: string;
}

export interface FeedbackData {
  guesses: Feedback[];
}
