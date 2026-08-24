/** Shared media shapes used by both the server helpers and the UI. */
export interface VideoHit {
  id: string;
  title: string;
  author: string;
  duration: number;
  views: number;
  thumb: string;
}

export interface MovieHit {
  id: string;
  title: string;
  year: string;
  poster: string | null;
  rating: string | null;
  genres: string[];
  description: string;
  cast: string[];
  runtime: string | null;
}
