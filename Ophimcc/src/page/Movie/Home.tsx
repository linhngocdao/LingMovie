import { useQuery } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import ImageWithFallback from '../../components/ImageWithFallback';
import Pagination from '../../components/Pagination';
import SEO from '../../components/SEO';
import { filterMovies, getAll } from '../../config/ophim';
import { Movie, MovieResponse } from '../../ultils/interfaces/movie.interface';
import MovieDetail from './movieDetail/MovieDetail';
import './style/Home.css';


const MovieList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const getRating = (movie: Movie) => {
    return (movie.tmdb && movie.tmdb.vote_average)
      ? movie.tmdb.vote_average.toFixed(1)
      : 'Chưa có đánh giá';
  };
  const getModifiedDate = (movie: Movie) => {
    try {
      return movie.modified?.time ? new Date(movie.modified.time).toLocaleDateString() : 'N/A';
    } catch {
      return 'N/A';
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);


  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    setIsMenuOpen(false);
  };

  const { data, isLoading, isError, error } = useQuery<MovieResponse, Error>({
    queryKey: ['movies', currentPage, debouncedSearch],
    queryFn: () => {
      if (debouncedSearch) {
        return filterMovies({ search: debouncedSearch, page: currentPage });
      }
      return getAll({ page: currentPage });
    },
  });
  console.log("duong", data);

  useEffect(() => {
    if (debouncedSearch && data && data.items.length > 0) {
      setIsSearchVisible(false);
    }
  }, [debouncedSearch, data]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  };


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMovieClick = (slug: string) => {
    setSelectedSlug(slug);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedSlug(null);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <SEO
        title="Trang chủ"
        description="Xem phim HD Online, phim hay mới cập nhật với chất lượng cao"
        keywords="xem phim, phim hay, phim hd, phim online, phim mới"
      />
      {/* Header */}
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} setDebouncedSearch={setDebouncedSearch} handleSearch={handleSearch} toggleSearch={toggleSearch} toggleMenu={toggleMenu} isSearchVisible={isSearchVisible} isMenuOpen={isMenuOpen} setCurrentPage={setCurrentPage} />

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {selectedSlug ? (
          <>
            <button
              onClick={handleBackToList}
              className="mb-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center space-x-2 text-sm sm:text-base"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Quay lại</span>
            </button>
            <MovieDetail slug={selectedSlug} />
          </>
        ) : (
          <>
            {isError ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-red-500">Đã có lỗi xảy ra: {(error as Error).message}</div>
              </div>
            ) : isLoading && !data ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-orange-500"></div>
              </div>
            ) : data && data.items.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-gray-400">Không có kết quả nào với từ khóa: "{debouncedSearch}"</div>
              </div>
            ) : data ? (
              <>
                <div className="grid grid-cols-2 sm:hidden gap-3">
                  {data.items.map((movie: Movie) => (
                    <div
                      key={movie._id}
                      className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => handleMovieClick(movie.slug)}
                    >
                      <div className="relative aspect-[2/3]">
                        <ImageWithFallback
                          src={`${data.pathImage}${movie.thumb_url}`}
                          alt={movie.name}
                          className="w-full h-full object-cover"
                          wrapperClassName="w-full h-full"
                          placeholder={
                            <div className="w-full h-full bg-gray-700 animate-pulse" />
                          }
                        />
                      </div>
                      <div className="p-2">
                        <h3 className="text-purple-400 text-sm font-medium line-clamp-2">
                          {movie.name}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">{movie.year}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-yellow-400 text-xs">★</span>
                          <span className="ml-1 text-xs">
                            {getRating(movie)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-700">
                        <th className="py-4 px-2 font-medium">TÊN</th>
                        <th className="py-4 px-2 font-medium">NĂM</th>
                        <th className="py-4 px-2 font-medium">ĐÁNH GIÁ</th>
                        <th className="py-4 px-2 font-medium">NGÀY CẬP NHẬT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.items.map((movie: Movie) => (
                        <tr
                          key={movie._id}
                          className="border-b border-gray-700 hover:bg-gray-800 cursor-pointer"
                          onClick={() => handleMovieClick(movie.slug)}
                        >
                          <td className="py-4 px-2">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-20 relative">
                                <ImageWithFallback
                                  src={`${data.pathImage}${movie.thumb_url}`}
                                  alt={movie.name}
                                  className="rounded object-cover w-full h-full"
                                  wrapperClassName="w-full h-full"
                                  placeholder={
                                    <div className="w-full h-full bg-gray-700 animate-pulse rounded" />
                                  }
                                />
                              </div>
                              <div>
                                <span className="text-purple-400 hover:text-purple-300 font-semibold">
                                  {movie.name}
                                </span>
                                <p className="text-sm text-gray-400">{movie.origin_name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-2">{movie.year}</td>
                          <td className="py-4 px-2">
                            <div className="flex items-center">
                              <span className="text-yellow-400">★</span>
                              <span className="ml-1">{getRating(movie)}</span>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-gray-400">
                            {getModifiedDate(movie)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  currentPage={data?.page || 1}
                  totalPages={data ? Math.ceil(data.total / data.limit) : 1}
                  onPageChange={handlePageChange}
                />
              </>
            ) : null}
          </>
        )}
      </main>
    </div>
  );
};

export default MovieList;
