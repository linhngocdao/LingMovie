import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const renderPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages.map((page, index) => {
      if (page === '...') {
        return <span key={`ellipsis-${index}`} className="px-2 sm:px-3 py-1">...</span>;
      }
      return (
        <button
          key={page}
          onClick={() => onPageChange(page as number)}
          className={`min-w-[32px] px-2 sm:px-3 py-1 rounded text-sm sm:text-base ${currentPage === page ? 'bg-orange-500 text-white' : 'hover:bg-gray-700'
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
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-1 sm:p-2 rounded hover:bg-gray-700 disabled:opacity-50"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      {renderPageNumbers()}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-1 sm:p-2 rounded hover:bg-gray-700 disabled:opacity-50"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};
export default Pagination;
