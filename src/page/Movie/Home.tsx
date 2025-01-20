import { useState } from 'react';
import { Moon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAll } from '../../config/ophim';
import MovieDetail from './movieDetail/MovieDetail';

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
  slug: string; // Thêm slug vào interface Movie
}

interface PaginationData {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

const MovieList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['getAllMovie', currentPage],
    queryFn: () => getAll({ page: currentPage }),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedSlug(null); // Reset selected movie when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMovieClick = (slug: string) => {
    setSelectedSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedSlug(null);
  };

  const PaginationControls = ({ pagination }: { pagination: PaginationData }) => {
    const { currentPage, totalPages } = pagination;

    const renderPageNumbers = () => {
      const pages = [];
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

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
          return <span key={`ellipsis-${index}`} className="px-3 py-1">...</span>;
        }
        return (
          <button
            key={page}
            onClick={() => handlePageChange(page as number)}
            className={`px-3 py-1 rounded ${currentPage === page
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
      <div className="flex items-center justify-center space-x-2 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded hover:bg-gray-700 disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        {renderPageNumbers()}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded hover:bg-gray-700 disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-orange-500">Web phim cho cheng</h1>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm phim..."
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="hover:text-orange-500">Phim Bộ</a>
                <a href="#" className="hover:text-orange-500">Phim Lẻ</a>
                <a href="#" className="hover:text-orange-500">Shows</a>
                <a href="#" className="hover:text-orange-500">Hoạt Hình</a>
              </nav>
              <button className="p-2 hover:bg-gray-700 rounded-full">
                <Moon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {selectedSlug ? (
          <>
            <button
              onClick={handleBackToList}
              className="mb-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center space-x-2"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Quay lại danh sách</span>
            </button>
            <MovieDetail slug={selectedSlug} />
          </>
        ) : isError ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500">Đã có lỗi xảy ra: {(error as Error).message}</div>
          </div>
        ) : isLoading && !data ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : data ? (
          <>
            <div className="overflow-x-auto">
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
                          <img
                            src={`${data.pathImage}${movie.thumb_url}`}
                            alt={movie.name}
                            className="w-16 h-20 object-cover rounded"
                          />
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
