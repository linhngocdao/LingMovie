import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Play, Film, Download, X } from 'lucide-react';
import { getDetail } from '../../../config/ophim';

interface MovieDetail {
  movie: {
    _id: string;
    name: string;
    origin_name: string;
    content: string;
    type: string;
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

interface MovieDetailProps {
  slug: string;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ slug }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['getMovieDetail', slug],
    queryFn: () => getDetail(slug),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const movieData = data?.movie as MovieDetail['movie'];
  const episodes = data?.episodes as MovieDetail['episodes'];

  const handleWatchMovie = (episodeLink?: string) => {
    const linkToPlay = episodeLink || episodes[0]?.server_data[0]?.link_embed;
    if (linkToPlay) {
      setCurrentEpisode(linkToPlay);
      setIsPlaying(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClosePlayer = () => {
    setIsPlaying(false);
    setCurrentEpisode(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-10">
      {/* Video Player Modal */}
      {isPlaying && currentEpisode && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
          <div className="flex justify-end p-4">
            <button
              onClick={handleClosePlayer}
              className="text-white hover:text-orange-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="w-full max-w-6xl aspect-video">
              <iframe
                src={currentEpisode}
                allowFullScreen
                className="w-full h-full rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Poster and Buttons */}
          <div className="md:col-span-1">
            <div className="relative group">
              <img
                src={movieData.thumb_url}
                alt={movieData.name}
                className="w-full rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleWatchMovie()}
                  className="bg-orange-500 text-white px-6 py-2 rounded-full flex items-center space-x-2 hover:bg-orange-600 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  <span>Xem Phim</span>
                </button>
              </div>
            </div>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => handleWatchMovie()}
                className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-purple-700 transition-colors"
              >
                <Film className="w-5 h-5" />
                <span>Xem Phim</span>
              </button>
              <button
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Lấy Nguồn</span>
              </button>
            </div>
          </div>

          {/* Movie Information */}
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold text-purple-400 mb-2">{movieData.name}</h1>
            <h2 className="text-xl text-blue-400 mb-4">{movieData.origin_name}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
              <div>
                <div className="mb-2">
                  <span className="text-gray-400">Trạng thái:</span>{' '}
                  {movieData.status === 'ongoing' ? movieData.episode_current : 'Hoàn thành'}
                </div>
                <div className="mb-2">
                  <span className="text-gray-400">Số tập:</span> {movieData.episode_total}
                </div>
                <div className="mb-2">
                  <span className="text-gray-400">Thời lượng:</span> {movieData.time}
                </div>
                <div className="mb-2">
                  <span className="text-gray-400">Năm phát hành:</span> {movieData.year}
                </div>
                <div className="mb-2">
                  <span className="text-gray-400">Chất lượng:</span> {movieData.quality}
                </div>
              </div>
              <div>
                <div className="mb-2">
                  <span className="text-gray-400">Ngôn ngữ:</span> {movieData.lang}
                </div>
                <div className="mb-2">
                  <span className="text-gray-400">Thể loại:</span>{' '}
                  {movieData.category.map((cat, index) => (
                    <span key={cat.id} className="text-blue-400 hover:underline cursor-pointer">
                      {cat.name}{index < movieData.category.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
                <div className="mb-2">
                  <span className="text-gray-400">Quốc gia:</span>{' '}
                  {movieData.country.map((country, index) => (
                    <span key={country.id} className="text-blue-400 hover:underline cursor-pointer">
                      {country.name}{index < movieData.country.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Nội dung phim</h3>
              <p className="text-gray-300 leading-relaxed">{movieData.content}</p>
            </div>
          </div>
        </div>

        {/* Episodes */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Danh sách tập</h3>
          {episodes.map((server) => (
            <div key={server.server_name} className="mb-6">
              <h4 className="text-purple-400 mb-3">SERVER: {server.server_name}</h4>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
                {server.server_data.map((episode) => (
                  <button
                    key={episode.slug}
                    onClick={() => handleWatchMovie(episode.link_embed)}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-center transition-colors"
                  >
                    {episode.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
