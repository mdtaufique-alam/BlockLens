import debounce from "lodash.debounce";
import React, { useContext, useRef, useState } from "react";
import { CryptoContext } from "../context/CryptoContext";

// Modern search component with enhanced UX
const SearchInput = ({ handleSearch }) => {
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { searchData, setSearchData, setSelectedCoinForChart, theme } = useContext(CryptoContext);

  let handleInput = (e) => {
    e.preventDefault();
    let query = e.target.value;
    setSearchText(query);
    handleSearch(query);
  };

  const getInputThemeClasses = () => {
    switch (theme) {
      case "light":
        return {
          input: "bg-white border-gray-400 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500",
          dropdown: "bg-white border-gray-400 text-gray-800 shadow-xl",
          item: "hover:bg-gray-100 text-gray-900",
          icon: "text-gray-500",
          itemText: "text-gray-900",
          itemSubtext: "text-gray-600"
        };
      default: // dark
        return {
          input: "bg-white/10 border-white/20 text-white placeholder-secondary-400 focus:ring-primary-500 focus:border-transparent",
          dropdown: "bg-white/10 border-white/20 text-white",
          item: "hover:bg-white/10 text-white",
          icon: "text-secondary-400",
          itemText: "text-white",
          itemSubtext: "text-secondary-400"
        };
    }
  };

  const inputClasses = getInputThemeClasses();

  const selectCoin = (coin) => {
    console.log("Coin selected from search:", coin);
    console.log("Setting selectedCoinForChart to:", coin.id);
    setSelectedCoinForChart(coin.id); // Set the selected coin for chart
    setSearchText("");
    setSearchData([]); // Clear search results
    setIsFocused(false);
    console.log("Search cleared and dropdown closed");
  };

  return (
    <div className="relative w-full">
      <form className="w-full">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className={`w-5 h-5 ${inputClasses.icon}`}
              fill="none"
              stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
          </div>
            <input
              type="search"
              name="searchText"
              id="searchTextDesktop"
              required
              value={searchText}
              onChange={handleInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className={`w-full pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${inputClasses.input}`}
            placeholder="Search cryptocurrencies..."
          />
        </div>
      </form>

      {/* Search Results Dropdown */}
      {searchText.length > 0 && isFocused && (
        <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl z-[9999] max-h-80 overflow-y-auto transform translate-y-0 ${inputClasses.dropdown}`}>
          {searchData ? (
            searchData.length > 0 ? (
              <div className="py-2">
                {searchData.map((coin) => (
                  <div
                  key={coin.id}
                    className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${inputClasses.item}`}
                    onClick={() => selectCoin(coin)}
                  >
                    <img
                      className="w-8 h-8 rounded-full mr-3"
                      src={coin.thumb}
                      alt={coin.name}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${inputClasses.itemText}`}>
                        {coin.name}
                      </p>
                      <p className={`text-xs uppercase ${inputClasses.itemSubtext}`}>
                        {coin.symbol}
                      </p>
                    </div>
                    <div className={`text-xs ${inputClasses.itemSubtext}`}>
                      #{coin.market_cap_rank || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <svg className={`w-12 h-12 mx-auto mb-4 ${inputClasses.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.57M15 6.343A7.962 7.962 0 0112 4c-2.34 0-4.29 1.009-5.824 2.57" />
                </svg>
                <p className={`text-sm ${inputClasses.itemSubtext}`}>No cryptocurrencies found</p>
                <p className={`text-xs mt-1 ${inputClasses.itemSubtext}`}>Try a different search term</p>
              </div>
            )
          ) : (
            <div className="px-4 py-8 text-center">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className={`text-sm ${inputClasses.itemSubtext}`}>Searching...</p>
            </div>
          )}
            </div>
          )}
    </div>
  );
};

export const SearchBar = () => {
  const { getSearchResult, setCurrency, currency, theme } = useContext(CryptoContext);
  const currencyRef = useRef();

  const handleCurrency = (e) => {
    e.preventDefault();
    let val = currencyRef.current.value;
    setCurrency(val);
    currencyRef.current.value = "";
  };
  
  const debounceFunc = debounce(function (val) {
    getSearchResult(val);
  }, 1000);

  const getThemeClasses = () => {
    switch (theme) {
      case "light":
        return {
          container: "bg-white border-gray-300 text-gray-800 shadow-lg",
          title: "text-gray-900",
          label: "text-gray-700",
          input: "bg-white border-gray-400 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500",
          select: "bg-white border-gray-400 text-gray-900 focus:ring-blue-500 focus:border-blue-500",
          option: "text-gray-900 bg-white",
          status: "text-gray-600"
        };
      default: // dark
        return {
          container: "glass-card",
          title: "text-white",
          label: "text-secondary-400",
          input: "bg-white/10 border-white/20 text-white placeholder-secondary-400 focus:ring-primary-500 focus:border-transparent",
          select: "bg-white/10 border-white/20 text-white focus:ring-primary-500 focus:border-transparent",
          option: "text-gray-600 bg-gray-800",
          status: "text-secondary-400"
        };
    }
  };

  const classes = getThemeClasses();

  return (
    <div className={`${classes.container} p-6 relative z-10`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-display font-bold ${classes.title}`}>
          Search & Filter
        </h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
          <span className={`text-xs font-medium ${classes.status}`}>Real-time</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Currency Selector */}
        <div className="sm:w-32">
          <label className={`block text-xs font-medium mb-2 ${classes.label}`}>
            Currency
          </label>
          <div className="relative">
          <select
            value={currency}
            onChange={handleCurrency}
            ref={currencyRef}
              className={`w-full rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 appearance-none cursor-pointer ${classes.select}`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem'
              }}
            >
              <option value="usd" className={classes.option}>USD</option>
              <option value="inr" className={classes.option}>INR</option>
              <option value="eur" className={classes.option}>EUR</option>
              <option value="jpy" className={classes.option}>JPY</option>
              <option value="aud" className={classes.option}>AUD</option>
              <option value="nzd" className={classes.option}>NZD</option>
              <option value="cad" className={classes.option}>CAD</option>
              <option value="gbp" className={classes.option}>GBP</option>
          </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex-1 relative">
          <label className={`block text-xs font-medium mb-2 ${classes.label}`}>
            Search Cryptocurrencies
          </label>
          <SearchInput handleSearch={debounceFunc} />
        </div>
      </div>
    </div>
  );
};