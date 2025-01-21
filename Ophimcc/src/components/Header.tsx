import { BadgeCheck, Menu, Search } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setDebouncedSearch: (term: string) => void;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toggleSearch: () => void;
  toggleMenu: () => void;
  isSearchVisible: boolean;
  isMenuOpen: boolean;
  setCurrentPage: (page: number) => void;
}

const propsAreEqual = (prevProps: HeaderProps, nextProps: HeaderProps) => {
  return (
    prevProps.searchTerm === nextProps.searchTerm &&
    prevProps.isSearchVisible === nextProps.isSearchVisible &&
    prevProps.isMenuOpen === nextProps.isMenuOpen
  );
};

const redirectToWebsite = () => {
  window.open('https://subsieutoc.net', '_blank');
};

const Header = React.memo(
  ({
    searchTerm,
    setSearchTerm,
    setDebouncedSearch,
    handleSearch,
    toggleSearch,
    toggleMenu,
    isSearchVisible,
    isMenuOpen,
    setCurrentPage,
  }: HeaderProps) => {
    const handleClearSearch = React.useCallback(() => {
      setSearchTerm('');
      setDebouncedSearch('');
      setCurrentPage(1);
    }, [setSearchTerm, setDebouncedSearch, setCurrentPage]);

    return (
      <header className="sticky top-0 z-50 bg-gray-800/70 backdrop-blur-lg shadow-md">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/">
              <h1 className="text-lg sm:text-2xl font-bold text-orange-500 whitespace-nowrap">
                Cheng iu dấu
              </h1>
            </Link>

            {/* Desktop Search */}
            <div className="hidden sm:flex items-center bg-gray-700/50 rounded-lg px-2">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Tìm kiếm phim..."
                className="bg-transparent text-white px-3 py-2 sm:w-64 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={handleClearSearch}
                className="p-2 hover:bg-gray-600 rounded-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-refresh-cw text-white"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 16H3v5" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation and Menu */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Mobile Search Icon */}
            <button
              className="sm:hidden p-2 hover:bg-gray-700 rounded-full"
              onClick={toggleSearch}
            >
              <Search className="w-5 h-5 text-white" />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6 text-white">
              <a href="#" className="hover:text-orange-500">
                Phim Bộ
              </a>
              <a href="#" className="hover:text-orange-500">
                Phim Lẻ
              </a>
              <a href="#" className="hover:text-orange-500">
                Shows
              </a>
              <a href="#" className="hover:text-orange-500">
                Hoạt Hình
              </a>
            </nav>

            {/* Theme Toggle and Mobile Menu */}
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-700 rounded-full" onClick={redirectToWebsite}>
                <BadgeCheck className="w-5 h-5 text-white" />
              </button>
              <button
                className="md:hidden p-2 hover:bg-gray-700 rounded-full"
                onClick={toggleMenu}
              >
                <Menu className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchVisible && (
          <div className="sm:hidden mt-3 px-4 py-2 bg-gray-800/70 flex items-center space-x-2">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Tìm kiếm phim..."
              className="bg-gray-700/50 text-white px-3 py-2 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              autoFocus
            />
            <button
              onClick={handleClearSearch}
              className="p-2 hover:bg-gray-600 rounded-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-refresh-cw text-white"
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
            </button>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-3 py-2 border-t border-gray-700 bg-gray-800/70 backdrop-blur-md">
            <a href="#" className="block py-2 hover:text-orange-500 text-white">
              Phim Bộ
            </a>
            <a href="#" className="block py-2 hover:text-orange-500 text-white">
              Phim Lẻ
            </a>
            <a href="#" className="block py-2 hover:text-orange-500 text-white">
              Shows
            </a>
            <a href="#" className="block py-2 hover:text-orange-500 text-white">
              Hoạt Hình
            </a>
          </nav>
        )}
      </header>
    );
  },
  propsAreEqual
);

Header.displayName = 'Header';

export default Header;
