import mongoose, { Schema, Document } from 'mongoose';

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

export interface IMovie extends Document {
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
  modified: {
    time: string;
  };
  category?: Category[];
  country?: Country[];
  actor?: string[];
  director?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MovieSchema = new Schema<IMovie>(
  {
    name: { type: String, required: true },
    // Bỏ index: true ở đây
    slug: { type: String, required: true },
    origin_name: { type: String, required: true },
    content: String,
    type: { type: String, required: true },
    status: { type: String, required: true },
    thumb_url: { type: String, required: true },
    poster_url: { type: String, required: true },
    // Bỏ index: true ở đây
    year: { type: Number, required: true },
    tmdb: {
      type: { type: String },
      id: String,
      season: Number,
      vote_average: Number,
      vote_count: Number,
    },
    imdb: {
      id: String,
    },
    modified: {
      time: String,
    },
    category: [{
      id: String,
      name: String,
      slug: String,
    }],
    country: [{
      id: String,
      name: String,
      slug: String,
    }],
    actor: [String],
    director: [String],
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Định nghĩa tất cả index một lần duy nhất
MovieSchema.index({ slug: 1 }, { unique: true });
MovieSchema.index({ year: 1 });
MovieSchema.index({ type: 1 });
MovieSchema.index({ 'category.slug': 1 });
MovieSchema.index({ 'country.slug': 1 });
MovieSchema.index({ createdAt: -1 });
MovieSchema.index(
  { name: 'text', origin_name: 'text' },
  { weights: { name: 2, origin_name: 1 } }
);


export const MovieModel = mongoose.model<IMovie>('Movie', MovieSchema);
