export interface MovieDetail {
  movie: {
    _id: string;
    name: string;
    origin_name: string;
    content: string;
    type: string;
    actor: string[];
    status: string;
    thumb_url: string;
    poster_url: string;
    time: string;
    episode_current: string;
    episode_total: string;
    quality: string;
    lang: string;
    year: number;
    category: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
    country: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  };
  episodes: Array<{
    server_name: string;
    server_data: Array<{
      name: string;
      slug: string;
      link_embed: string;
    }>;
  }>;
}

export interface MovieDetailProps {
  slug: string;
}

export interface Movie {
  _id: string;
  name: string;
  origin_name: string;
  thumb_url: string;
  year: number;
  modified: {
    time: string;
  };
  tmdb?: {
    type: string | null;
    id: string | number;
    season: number | null;
    vote_average: number;
    vote_count: number;
  };
  slug: string;
  actor: string[];
  category: string[];
  country: string[];
  director: string[];
  imdb: {
    id: string;
  };
  poster_url: string;
  createdAt: string;
  updatedAt: string;
}

export interface MovieResponse {
  status: boolean;
  total: number;
  page: number;
  limit: number;
  items: Movie[];
  pathImage: string;
}
