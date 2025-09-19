import React, { useContext } from "react";
import { CryptoContext } from "../context/CryptoContext";
import Pagination from "./Pagination";

/* Modern sidebar with crypto market data and filtering options */
export const SideBar = () => {
  const { cryptoData, setSortBy, resetFunction, currency } = useContext(CryptoContext);

  return (
    <div className="glass-card h-fit">
      {/* Header Section */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-bold text-white">
            Market Overview
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-xs text-secondary-400 font-medium">Live</span>
          </div>
        </div>
        
        {/* Filter Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs text-secondary-400 font-medium">
              Sort By
            </label>
            <button
              onClick={resetFunction}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              title="Reset filters"
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          
          <div className="relative">
            <select
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem'
              }}
            >
              <option value="" className="text-gray-600 bg-gray-800">Select sorting...</option>
              <option value="market_cap_desc" className="text-gray-600 bg-gray-800">Market Cap (High to Low)</option>
              <option value="market_cap_asc" className="text-gray-600 bg-gray-800">Market Cap (Low to High)</option>
              <option value="volume_desc" className="text-gray-600 bg-gray-800">Volume (High to Low)</option>
              <option value="volume_asc" className="text-gray-600 bg-gray-800">Volume (Low to High)</option>
              <option value="id_desc" className="text-gray-600 bg-gray-800">Name (Z to A)</option>
              <option value="id_asc" className="text-gray-600 bg-gray-800">Name (A to Z)</option>
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