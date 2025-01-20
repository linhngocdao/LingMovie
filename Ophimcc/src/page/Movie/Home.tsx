import { useState } from 'react';
import { Moon, ChevronLeft, ChevronRight, Menu, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { getAll } from '../../config/ophim';
import MovieDetail from './movieDetail/MovieDetail';
import './style/Home.css';

interface Movie {
  _id: string;
  name: string;
  origin_name: string;
  thumb_url: string;
  year: number;
  modified: {
    time: string;
  };
  tmdb: {
    vote_average: number;
  };
  slug: string;
}

interface PaginationData {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

// Image with Fallback Component
const ImageWithFallback = ({ src, alt, className, wrapperClassName, ...props }: any) => {
  const fallbackImage = "https://placehold.co/300x400/png"; // Placeholder image

  return (
    <LazyLoadImage
      src={src}
      alt={alt}
      effect="blur"
      className={className}
      wrapperClassName={wrapperClassName}
      onError={(e: any) => {
        e.target.src = fallbackImage;
      }}
      threshold={100}
      {...props}
    />
  );
};

const MovieList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    setIsMenuOpen(false);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['getAllMovie', currentPage],
    queryFn: () => getAll({ page: currentPage }),
  });

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

  const PaginationControls = ({ pagination }: { pagination: PaginationData }) => {
    const { currentPage, totalPages } = pagination;

    const renderPageNumbers = () => {
      const pages = [];
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(totalPages, currentPage + 1);

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }

      return pages.map((page, index) => {
        if (page === '...') {
          return <span key={`ellipsis-${index}`} className="px-2 sm:px-3 py-1">...</span>;
        }
        return (
          <button
            key={page}
            onClick={() => handlePageChange(page as number)}
            className={`min-w-[32px] px-2 sm:px-3 py-1 rounded text-sm sm:text-base ${currentPage === page
              ? 'bg-orange-500 text-white'
              : 'hover:bg-gray-700'
              }`}
          >
            {page}
          </button>
        );
      });
    };

    return (
      <div className="flex items-center justify-center space-x-1 sm:space-x-2 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 sm:p-2 rounded hover:bg-gray-700 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        {renderPageNumbers()}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 sm:p-2 rounded hover:bg-gray-700 disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 py-3 sm:py-4 sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <h1 className="text-lg sm:text-2xl font-bold text-orange-500 whitespace-nowrap">Cheng iu dấu</h1>
              <div className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder="Tìm kiếm phim..."
                  className="bg-gray-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg w-48 sm:w-64 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-6">
              {/* Mobile Search Icon */}
              <button
                className="sm:hidden p-2 hover:bg-gray-700 rounded-full"
                onClick={toggleSearch}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="hover:text-orange-500">Phim Bộ</a>
                <a href="#" className="hover:text-orange-500">Phim Lẻ</a>
                <a href="#" className="hover:text-orange-500">Shows</a>
                <a href="#" className="hover:text-orange-500">Hoạt Hình</a>
              </nav>

              {/* Theme Toggle & Mobile Menu */}
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-700 rounded-full">
                  <Moon className="w-5 h-5" />
                </button>
                <button
                  className="md:hidden p-2 hover:bg-gray-700 rounded-full"
                  onClick={toggleMenu}
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchVisible && (
            <div className="sm:hidden mt-3 animate-slide-down">
              <input
                type="text"
                placeholder="Tìm kiếm phim..."
                className="bg-gray-700 text-white px-3 py-1.5 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                autoFocus
              />
            </div>
          )}

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="md:hidden mt-3 py-2 border-t border-gray-700">
              <a href="#" className="block py-2 hover:text-orange-500">Phim Bộ</a>
              <a href="#" className="block py-2 hover:text-orange-500">Phim Lẻ</a>
              <a href="#" className="block py-2 hover:text-orange-500">Shows</a>
              <a href="#" className="block py-2 hover:text-orange-500">Hoạt Hình</a>
            </nav>
          )}
        </div>
      </header>

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
        ) : isError ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500">Đã có lỗi xảy ra: {(error as Error).message}</div>
          </div>
        ) : isLoading && !data ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : data ? (
          <>
            {/* Grid view for mobile */}
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
                      <span className="ml-1 text-xs">{movie.tmdb.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table view for desktop */}
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
                            <h3 className="text-purple-400 hover:text-purple-300">
                              {movie.name}
                            </h3>
                            <p className="text-sm text-gray-400">{movie.origin_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2">{movie.year}</td>
                      <td className="py-4 px-2">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">{movie.tmdb.vote_average.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-gray-400">
                        {new Date(movie.modified.time).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data.pagination && (
              <PaginationControls pagination={data.pagination} />
            )}
          </>
        ) : null}
      </main>
    </div>
  );
};

export default MovieList;
