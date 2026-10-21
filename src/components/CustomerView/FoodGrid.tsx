import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodCard } from './FoodCard';
import {
  Utensils,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';

export const FoodGrid: React.FC = () => {
  const {
    foods,
    selectedCategoryId,
    searchQuery,
    inStockOnly,
    sortBy,
    priceFilter,
    setPriceFilter,
    healthyOnly,
    setHealthyOnly,
    setSearchQuery,
    setSelectedCategoryId,
    setInStockOnly,
  } = useApp();

  // Pagination states: default 8 items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const gridRef = useRef<HTMLDivElement>(null);

  // Auto reset to page 1 whenever any filter/search/sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategoryId, searchQuery, inStockOnly, sortBy, priceFilter, healthyOnly, pageSize]);

  // Filter logic
  const filtered = foods.filter((food) => {
    // Category match
    if (selectedCategoryId !== 'all' && food.categoryId !== selectedCategoryId) {
      return false;
    }
    // Search match
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchName = food.name ? food.name.toLowerCase().includes(q) : false;
      const matchDesc = food.description ? food.description.toLowerCase().includes(q) : false;
      const matchCategory = food.categoryName ? food.categoryName.toLowerCase().includes(q) : false;
      const matchTags = Array.isArray(food.tags)
        ? food.tags.some((t) => typeof t === 'string' && t.toLowerCase().includes(q))
        : false;
      if (!matchName && !matchDesc && !matchCategory && !matchTags) {
        return false;
      }
    }
    // In-stock only
    if (inStockOnly && (!food.isAvailable || (food.stockQuantity ?? 0) <= 0)) {
      return false;
    }
    // Price range filter
    if (priceFilter === 'under30' && (food.price ?? 0) >= 30000) return false;
    if (priceFilter === '30to45' && ((food.price ?? 0) < 30000 || (food.price ?? 0) > 45000)) return false;
    if (priceFilter === 'above45' && (food.price ?? 0) <= 45000) return false;

    // Healthy / Low calorie filter (< 550 kcal or veggie)
    if (healthyOnly) {
      const isLowCal = food.calories ? food.calories <= 550 : false;
      const isVeggie = food.categoryId === 'mon-chay';
      const isCleanTag = Array.isArray(food.tags)
        ? food.tags.some(
            (t) =>
              typeof t === 'string' &&
              ['healthy', 'chay', 'thanh mát', 'giàu đạm'].some((kw) =>
                t.toLowerCase().includes(kw)
              )
          )
        : false;
      if (!isLowCal && !isVeggie && !isCleanTag) return false;
    }

    return true;
  });

  // Sort logic
  filtered.sort((a, b) => {
    if (sortBy === 'price-asc') return (a.price ?? 0) - (b.price ?? 0);
    if (sortBy === 'price-desc') return (b.price ?? 0) - (a.price ?? 0);
    if (sortBy === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
    // Popular: by reviewCount or default order
    return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategoryId('all');
    setInStockOnly(false);
    setPriceFilter('all');
    setHealthyOnly(false);
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const pagedFoods = filtered.slice(startIndex, endIndex);

  // Smooth scroll to top of menu grid
  const scrollToMenuTop = () => {
    if (gridRef.current) {
      const yOffset = -90; // Offset for sticky navbar
      const y = gridRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === validCurrentPage) return;
    setCurrentPage(newPage);
    scrollToMenuTop();
  };

  // Generate pagination numbers array with ellipsis
  const getPaginationItems = (): (number | string)[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const items: (number | string)[] = [];
    const current = validCurrentPage;

    // Always include page 1
    items.push(1);

    if (current > 3) {
      items.push('...');
    }

    // Neighbors around current page
    const start = Math.max(2, current - 1);
    const end = Math.min(totalPages - 1, current + 1);

    for (let i = start; i <= end; i++) {
      items.push(i);
    }

    if (current < totalPages - 2) {
      items.push('...');
    }

    // Always include last page
    items.push(totalPages);

    return items;
  };

  if (totalItems === 0) {
    return (
      <div className="py-16 text-center flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-300 p-8 my-6 shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 shadow-inner">
          <Utensils className="w-7 h-7" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          Không tìm thấy món ăn phù hợp
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed">
          Vui lòng thử từ khóa tìm kiếm khác hoặc đặt lại bộ lọc để xem toàn bộ thực đơn căn tin hôm nay.
        </p>
        <button
          onClick={resetFilters}
          className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-bold hover:bg-slate-800 transition-all shadow-sm active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Đặt lại bộ lọc</span>
        </button>
      </div>
    );
  }

  return (
    <div ref={gridRef} id="menu-grid-section" className="space-y-6 my-6 scroll-mt-24">
      {/* 1. Header Toolbar: Meta Info & Page Size Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:px-5 sm:py-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>
            Hiển thị món <strong className="text-slate-900 font-bold font-mono-nums">{startIndex + 1}</strong> –{' '}
            <strong className="text-slate-900 font-bold font-mono-nums">{endIndex}</strong> trên tổng số{' '}
            <strong className="text-amber-700 font-bold font-mono-nums">{totalItems}</strong> món
          </span>
        </div>

        {/* Page Size Selector */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Số món / trang:</span>
          </div>
          <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
            {[8, 12, 16, 24].map((size) => (
              <button
                key={size}
                onClick={() => setPageSize(size)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  pageSize === size
                    ? 'bg-white text-amber-800 shadow-2xs font-mono-nums'
                    : 'text-slate-500 hover:text-slate-900 font-mono-nums'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Grid of Food Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {pagedFoods.map((food) => (
          <FoodCard key={food.id} food={food} />
        ))}
      </div>

      {/* 3. Pagination Controls Bar */}
      {totalPages > 1 && (
        <div className="mt-8 pt-4 pb-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left info badge */}
          <div className="text-xs text-slate-500 order-2 sm:order-1">
            Trang <strong className="text-slate-900 font-bold font-mono-nums">{validCurrentPage}</strong> /{' '}
            <strong className="font-mono-nums">{totalPages}</strong>
          </div>

          {/* Center page buttons */}
          <div className="flex items-center gap-1.5 order-1 sm:order-2 flex-wrap justify-center">
            {/* Previous Page Button */}
            <button
              onClick={() => handlePageChange(validCurrentPage - 1)}
              disabled={validCurrentPage === 1}
              className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs active:scale-95"
              title="Trang trước"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden xs:inline">Trước</span>
            </button>

            {/* Numeric Page Buttons */}
            {getPaginationItems().map((item, index) => {
              if (item === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="w-8 h-9 flex items-center justify-center text-slate-400 font-bold text-xs select-none"
                  >
                    …
                  </span>
                );
              }

              const pageNum = Number(item);
              const isActive = pageNum === validCurrentPage;

              return (
                <button
                  key={`page-${pageNum}`}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold font-mono-nums transition-all flex items-center justify-center ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold shadow-md shadow-amber-500/25 scale-105'
                      : 'border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-300 text-slate-700 shadow-2xs'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next Page Button */}
            <button
              onClick={() => handlePageChange(validCurrentPage + 1)}
              disabled={validCurrentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs active:scale-95"
              title="Trang sau"
            >
              <span className="hidden xs:inline">Sau</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick jump note or tip */}
          <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-400 order-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Chuyển trang tự động cuộn lên đầu</span>
          </div>
        </div>
      )}
    </div>
  );
};
