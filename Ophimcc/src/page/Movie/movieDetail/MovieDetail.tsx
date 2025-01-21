import { useQuery } from '@tanstack/react-query';
import { Film, Phone, Play, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { getDetail } from '../../../config/ophim';
import type { MovieDetail, MovieDetailProps } from '../../../ultils/interfaces/movie.interface';
import SEO from '../../../components/SEO';

const MovieDetail = ({ slug }: MovieDetailProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState<string | null>(null);
  const [selectedServerIndex, setSelectedServerIndex] = useState(0);
  const [watchedEpisodes, setWatchedEpisodes] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const loadWatchedEpisodes = () => {
      const saved = localStorage.getItem(`watched-${slug}`);
      if (saved) {
        setWatchedEpisodes(JSON.parse(saved));
      }
    };
    loadWatchedEpisodes();
  }, [slug]);

  const { data, isLoading } = useQuery({
    queryKey: ['getMovieDetail', slug],
    queryFn: () => getDetail(slug),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const movieData = data?.movie as MovieDetail['movie'];
  const episodes = data?.episodes as MovieDetail['episodes'];

  const handleWatchMovie = (episodeLink?: string, episodeSlug?: string) => {
    const linkToPlay = episodeLink || episodes[0]?.server_data[0]?.link_embed;
    if (linkToPlay) {
      setCurrentEpisode(linkToPlay);
      setIsPlaying(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (episodeSlug) {
        const newWatchedEpisodes = { ...watchedEpisodes, [episodeSlug]: true };
        setWatchedEpisodes(newWatchedEpisodes);
        localStorage.setItem(`watched-${slug}`, JSON.stringify(newWatchedEpisodes));
      }
    }
  };

  const handleClosePlayer = () => {
    setIsPlaying(false);
    setCurrentEpisode(null);
  };

  const handleServerChange = (index: number) => {
    setSelectedServerIndex(index);
  };

  const ContactAdmin = () => {
    window.open('https://www.facebook.com/linhdaongoc22', '_blank');
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-6 sm:pb-10">
      <SEO
        title={movieData.name}
        description={movieData.content}
        keywords={"phim mới, phim hay, phim hd, phim online, phim mới"}
        image={movieData.thumb_url}
        type="video.movie"
      />
      {isPlaying && currentEpisode && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex justify-between items-center p-2 sm:p-4 bg-gray-800">
            <h2 className="text-lg font-medium truncate px-2">{movieData.name}</h2>
            <button
              onClick={handleClosePlayer}
              className="text-white hover:text-orange-500 transition-colors p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-full">
              <iframe
                src={currentEpisode}
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="sm:hidden mb-4">
          <h1 className="text-xl font-bold text-purple-400">{movieData.name}</h1>
          <h2 className="text-lg text-blue-400 mt-1">{movieData.origin_name}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="sm:col-span-1">
            <div className="relative aspect-[2/3] sm:aspect-auto">
              <LazyLoadImage
                src={movieData.thumb_url}
                alt={movieData.name}
                effect="blur"
                className="w-full rounded-lg shadow-lg"
                wrapperClassName="w-full h-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center sm:opacity-0 sm:hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleWatchMovie()}
                  className="bg-orange-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-orange-600 transition-colors"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Xem Phim</span>
                </button>
              </div>
            </div>
            <div className="flex space-x-2 sm:space-x-4 mt-4">
              <button
                onClick={() => handleWatchMovie()}
                className="flex-1 bg-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center justify-center space-x-1 sm:space-x-2 hover:bg-purple-700 transition-colors"
              >
                <Film className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Xem Phim</span>
              </button>
              <button className="flex-1 bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center justify-center space-x-1 sm:space-x-2 hover:bg-blue-700 transition-colors" onClick={ContactAdmin}>
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Liên hệ admin</span>
              </button>
            </div>
          </div>

          {/* Movie Information */}
          <div className="sm:col-span-2">
            {/* Desktop Title */}
            <div className="hidden sm:block mb-6">
              <h1 className="text-3xl font-bold text-purple-400">{movieData.name}</h1>
              <h2 className="text-xl text-blue-400 mt-2">{movieData.origin_name}</h2>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:gap-6 text-sm sm:text-base mb-6">
              <div className="col-span-2 sm:col-span-1">
                <span className="text-gray-400">Trạng thái:</span>{' '}
                <span className="text-orange-400">
                  {movieData.status === 'ongoing' ? movieData.episode_current : 'Hoàn thành'}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-gray-400">Số tập:</span>{' '}
                <span>{movieData.episode_total}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-gray-400">Thời lượng:</span>{' '}
                <span>{movieData.time}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-gray-400">Năm:</span>{' '}
                <span>{movieData.year}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-gray-400">Chất lượng:</span>{' '}
                <span>{movieData.quality}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-gray-400">Ngôn ngữ:</span>{' '}
                <span>{movieData.lang}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-400">Thể loại:</span>{' '}
                <span className="text-blue-400">
                  {movieData.category.map((cat, index) => (
                    <span key={cat.id} className="hover:underline cursor-pointer">
                      {cat.name}{index < movieData.category.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-400">Quốc gia:</span>{' '}
                <span className="text-blue-400">
                  {movieData.country.map((country, index) => (
                    <span key={country.id} className="hover:underline cursor-pointer">
                      {country.name}{index < movieData.country.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </span>
              </div>
            </div>
            <div>
              <span className="text-gray-400">Diễn viên:</span>{' '}
              <span className="text-white">
                {movieData.actor && movieData.actor.length > 0
                  ? movieData.actor.join(', ')
                  : 'Chưa có thông tin'}
              </span>
            </div>

            <div className="mt-4 sm:mt-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Nội dung phim</h3>
              <div
                className="text-gray-300 text-sm sm:text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: movieData.content }}
              />
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Danh sách tập</h3>
          {episodes.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {episodes.map((server, index) => (
                <button
                  key={server.server_name}
                  onClick={() => handleServerChange(index)}
                  className={`px-3 py-1.5 rounded text-sm ${selectedServerIndex === index
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                  {server.server_name}
                </button>
              ))}
            </div>
          )}

          {/* Episode Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
            {episodes[selectedServerIndex]?.server_data.map((episode) => (
              <button
                key={episode.slug}
                onClick={() => handleWatchMovie(episode.link_embed, episode.slug)}
                className={`relative px-2 sm:px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-center text-sm transition-colors group ${watchedEpisodes[episode.slug] ? 'ring-1 ring-orange-500' : ''
                  }`}
              >
                {episode.name}
                {watchedEpisodes[episode.slug] && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full">
                    <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping"></div>
                  </div>
                )}
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {watchedEpisodes[episode.slug] ? 'Đã xem' : 'Chưa xem'}
                </div>
              </button>
            ))}
          </div>
          {Object.keys(watchedEpisodes).length > 0 && (
            <button
              onClick={() => {
                localStorage.removeItem(`watched-${slug}`);
                setWatchedEpisodes({});
              }}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
            >
              Đánh dấu tất cả chưa xem
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
