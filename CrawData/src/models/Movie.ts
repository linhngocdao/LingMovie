interface TMDB {
  type: string;
  id: string;
  season: number | null;
  vote_average: number;
  vote_count: number;
}

interface IMDB {
  id: string | null;
}

interface Modified {
  time: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Country {
  id: string;
  name: string;
  slug: string;
}

export interface Movie {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  content?: string;
  type: string;
  status: string;
  thumb_url: string;
  poster_url: string;
  year: number;
  tmdb: TMDB;
  imdb: IMDB;
  modified: Modified;
  category?: Category[];
  country?: Country[];
  actor?: string[];
  director?: string[];
}
