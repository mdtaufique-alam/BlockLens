import React, { useContext } from "react";
import { CryptoContext } from "../context/CryptoContext";

// Modern pagination component
const Pagination = () => {
  const { cryptoData, totalPages, page, setPage, perPage } = useContext(CryptoContext);

  const TotalNumber = Math.ceil(totalPages / perPage);

  const next = () => {
    if (page < TotalNumber) {
      setPage(page + 1);
    }
  };

  const prev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= TotalNumber) {
      setPage(pageNum);
    }
  };

  // Don't show pagination if no data or less than one page
  if (!cryptoData || cryptoData.length < perPage || TotalNumber <= 1) {
    return null;
  }

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (TotalNumber <= maxVisible) {
      for (let i = 1; i <= TotalNumber; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(TotalNumber);
      } else if (page >= TotalNumber - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = TotalNumber - 3; i <= TotalNumber; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(TotalNumber);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="text-xs text-secondary-400">
        Page {page} of {TotalNumber}
      </div>
      
      <div className="flex items-center space-x-1">
        {/* Previous Button */}
        <button
          onClick={prev}
          disabled={page === 1}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Previous page"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {getPageNumbers().map((pageNum, index) => (
            <button
              key={index}
              onClick={() => typeof pageNum === 'number' ? goToPage(pageNum) : null}
              disabled={pageNum === '...'}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                pageNum === page
                  ? 'bg-primary-500 text-white'
                  : pageNum === '...'
                  ? 'text-secondary-400 cursor-default'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={next}
          disabled={page === TotalNumber}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Next page"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;