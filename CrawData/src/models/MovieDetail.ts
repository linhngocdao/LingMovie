import mongoose, { Schema, Document } from 'mongoose';

// Interface cho episode data
interface ServerData {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

interface Episode {
  server_name: string;
  server_data: ServerData[];
}

// Interface cho movie data
interface TMDB {
  type: string | null;
  id: string;
  season: number | null;
  vote_average: number;
  vote_count: number;
}

interface IMDB {
  id: string;
}

interface TimeStamp {
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

export interface IMovieDetail extends Document {
  movie: {
    tmdb: TMDB;
    imdb: IMDB;
    created: TimeStamp;
    modified: TimeStamp;
    name: string;
    origin_name: string;
    content: string;
    type: string;
    status: string;
    thumb_url: string;
    trailer_url: string;
    time: string;
    episode_current: string;
    episode_total: string;
    quality: string;
    lang: string;
    notify: string;
    showtimes: string;
    slug: string;
    year: number;
    view: number;
    actor: string[];
    director: string[];
    category: Category[];
    country: Country[];
    is_copyright: boolean;
    chieurap: boolean;
    poster_url: string;
    sub_docquyen: boolean;
  };
  episodes: Episode[];
}

const MovieDetailSchema = new Schema<IMovieDetail>(
  {
    movie: {
      tmdb: {
        type: { type: String, default: null },
        id: { type: String, default: '' },
        season: { type: Number, default: null },
        vote_average: { type: Number, default: 0 },
        vote_count: { type: Number, default: 0 }
      },
      imdb: {
        id: { type: String, default: '' }
      },
      created: {
        time: { type: String }
      },
      modified: {
        time: { type: String }
      },
      name: { type: String, required: true },
      origin_name: { type: String, required: true },
      content: { type: String },
      type: { type: String, required: true },
      status: { type: String, required: true },
      thumb_url: { type: String, required: true },
      trailer_url: { type: String },
      time: { type: String },
      episode_current: { type: String },
      episode_total: { type: String },
      quality: { type: String },
      lang: { type: String },
      notify: { type: String },
      showtimes: { type: String },
      slug: { type: String, required: true, unique: true },
      year: { type: Number, required: true },
      view: { type: Number, default: 0 },
      actor: [String],
      director: [String],
      category: [{
        id: String,
        name: String,
        slug: String
      }],
      country: [{
        id: String,
        name: String,
        slug: String
      }],
      is_copyright: { type: Boolean, default: false },
      chieurap: { type: Boolean, default: false },
      poster_url: { type: String },
      sub_docquyen: { type: Boolean, default: false }
    },
    episodes: [{
      server_name: { type: String, required: true },
      server_data: [{
        name: { type: String, required: true },
        slug: { type: String, required: true },
        filename: { type: String },
        link_embed: { type: String, required: true },
        link_m3u8: { type: String, required: true }
      }]
    }]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Index để tìm kiếm nhanh
MovieDetailSchema.index({ 'movie.slug': 1 }, { unique: true });
MovieDetailSchema.index({ 'movie.name': 'text', 'movie.origin_name': 'text' });

export const MovieDetailModel = mongoose.model<IMovieDetail>('MovieDetail', MovieDetailSchema);
