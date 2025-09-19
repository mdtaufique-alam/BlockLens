import React, { useContext } from "react";
import { CryptoContext } from "../context/CryptoContext";
import Pagination from "./Pagination";

/* Modern sidebar with crypto market data and filtering options */
export const SideBar = () => {
  const { cryptoData, setSortBy, resetFunction, currency, theme } = useContext(CryptoContext);

  const getThemeClasses = () => {
    switch (theme) {
      case "light":
        return {
          container: "bg-white border-gray-300 text-gray-800 shadow-lg",
          title: "text-gray-900",
          subtitle: "text-gray-600",
          label: "text-gray-700",
          select: "bg-white border-gray-400 text-gray-900 focus:ring-blue-500 focus:border-blue-500",
          option: "text-gray-900 bg-white",
          button: "bg-gray-100 text-gray-700 hover:bg-gray-200",
          border: "border-gray-200"
        };
      default: // dark
        return {
          container: "glass-card",
          title: "text-white",
          subtitle: "text-secondary-400",
          label: "text-secondary-400",
          select: "bg-white/10 border-white/20 text-white focus:ring-primary-500 focus:border-transparent",
          option: "text-gray-600 bg-gray-800",
          button: "bg-white/10 text-white hover:bg-white/20",
          border: "border-white/10"
        };
    }
  };

  const classes = getThemeClasses();

  return (
    <div className={`${classes.container} h-fit`}>
      {/* Header Section */}
      <div className={`p-6 border-b ${classes.border}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-display font-bold ${classes.title}`}>
            Market Overview
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className={`text-xs font-medium ${classes.subtitle}`}>Live</span>
          </div>
        </div>
        
        {/* Filter Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className={`text-xs font-medium ${classes.label}`}>
              Sort By
            </label>
            <button
              onClick={resetFunction}
              className={`p-1.5 rounded-lg transition-colors ${classes.button}`}
              title="Reset filters"
            >
              <svg className={`w-3.5 h-3.5 ${classes.subtitle}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          
          <div className="relative">
            <select
              onChange={(e) => setSortBy(e.target.value)}
              className={`w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 appearance-none cursor-pointer ${classes.select}`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem'
              }}
            >
              <option value="" className={classes.option}>Select sorting...</option>
              <option value="market_cap_desc" className={classes.option}>Market Cap (High to Low)</option>
              <option value="market_cap_asc" className={classes.option}>Market Cap (Low to High)</option>
              <option value="volume_desc" className={classes.option}>Volume (High to Low)</option>
              <option value="volume_asc" className={classes.option}>Volume (Low to High)</option>
              <option value="id_desc" className={classes.option}>Name (Z to A)</option>
              <option value="id_asc" className={classes.option}>Name (A to Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Crypto List */}
      <div className="max-h-96 overflow-y-auto">
        {cryptoData ? (
          <div className="divide-y divide-white/10">
            {cryptoData.map((crypto, index) => (
              <div
                key={crypto.id}
                className="p-4 hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  {/* Rank */}
                  <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{index + 1}</span>
                  </div>
                  
                  {/* Coin Image */}
                  <img
                    src={crypto.image}
                    alt={crypto.name}
                    className="w-8 h-8 rounded-full"
                  />
                  
                  {/* Coin Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-semibold text-white truncate">
                        {crypto.name}
                      </h3>
                      <span className="text-xs text-secondary-400 uppercase">
                        {crypto.symbol}
                      </span>
                    </div>
                    
                    {/* Price Change */}
                    <div className="flex items-center space-x-2 mt-1">
                      <div
                        className={`flex items-center space-x-1 text-xs font-medium ${
                          crypto.market_cap_change_percentage_24h > 0
                            ? "text-success"
                            : "text-error"
                        }`}
                      >
                        <svg
                          className={`w-3 h-3 ${
                            crypto.market_cap_change_percentage_24h > 0
                              ? "rotate-0"
                              : "rotate-180"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>
                          {Math.abs(parseFloat(crypto.market_cap_change_percentage_24h)).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Market Cap */}
                  <div className="text-right">
                    <p className="text-xs text-secondary-400">Market Cap</p>
                    <p className="text-sm font-semibold text-white">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: currency,
                        notation: "compact",
                        maximumFractionDigits: 1,
                      }).format(crypto.market_cap)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-secondary-400 text-sm">Loading market data...</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-white/10">
        <Pagination />
      </div>
    </div>
  );
};

export default SideBar;