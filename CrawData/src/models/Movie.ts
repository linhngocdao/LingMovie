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
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    origin_name: { type: String, required: true },
    content: String,
    type: { type: String, required: true },
    status: { type: String, required: true },
    thumb_url: { type: String, required: true },
    poster_url: { type: String, required: true },
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
    versionKey: false,
    strict: true
  }
);

MovieSchema.index({ slug: 1 }, { unique: true, background: true });
MovieSchema.index({ year: 1 }, { background: true });
MovieSchema.index({ type: 1 }, { background: true });
MovieSchema.index({ 'category.slug': 1 }, { background: true });
MovieSchema.index({ 'country.slug': 1 }, { background: true });
MovieSchema.index({ createdAt: -1 }, { background: true });
MovieSchema.index(
  { name: 'text', origin_name: 'text' },
  {
    weights: { name: 2, origin_name: 1 },
    background: true
  }
);

MovieSchema.pre('save', function(next) {
  if (this.slug) {
    this.slug = this.slug.toLowerCase().trim();
  }
  next();
});

export const MovieModel = mongoose.model<IMovie>('Movie', MovieSchema);
