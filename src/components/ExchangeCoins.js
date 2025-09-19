import React, { useEffect, useState, useCallback, useMemo, useContext } from 'react';
import { CryptoContext } from '../context/CryptoContext';

// Modern cryptocurrency exchange component
export const ExchangeCoins = () => {
  const { theme } = useContext(CryptoContext);
  const [text1, settext1] = useState("");
  const [text2, settext2] = useState(0);
  const [units, setUnits] = useState("");
  const [value1, setvalue1] = useState("bitcoin");
  const [value2, setvalue2] = useState("ethereum");
  const [loading, setLoading] = useState(false);
  const [cryptoList, setCryptoList] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});

  // Popular cryptocurrencies for exchange
  const popularCryptos = useMemo(() => [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    { id: 'binancecoin', name: 'BNB', symbol: 'BNB' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
    { id: 'solana', name: 'Solana', symbol: 'SOL' },
    { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
    { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE' },
    { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX' },
    { id: 'chainlink', name: 'Chainlink', symbol: 'LINK' },
    { id: 'litecoin', name: 'Litecoin', symbol: 'LTC' }
  ], []);

  const fetchExchangeRates = useCallback(async () => {
    try {
      const cryptoIds = popularCryptos.map(crypto => crypto.id).join(',');
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=usd&x_cg_demo_api_key=CG-aRQSKpsxefpQ38K9eVK2mUwX`);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Exchange rates fetched:", data);
        setExchangeRates(data);
        setCryptoList(popularCryptos);
      } else {
        console.error("Failed to fetch exchange rates:", response.status);
      }
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    }
  }, [popularCryptos]);

  useEffect(() => {
    // Fetch exchange rates for popular cryptocurrencies
    fetchExchangeRates();
  }, [fetchExchangeRates]);

  const convert = async () => {
    if (!text1 || !exchangeRates[value1] || !exchangeRates[value2]) {
      console.log("Conversion blocked:", { text1, value1, value2, exchangeRates });
      return;
    }
    
    setLoading(true);
    
    try {
      // Get USD values
      const sourceUsdValue = exchangeRates[value1]?.usd || 0;
      const targetUsdValue = exchangeRates[value2]?.usd || 0;
      
      console.log("Conversion values:", { 
        sourceUsdValue, 
        targetUsdValue, 
        amount: text1,
        source: value1,
        target: value2
      });
      
      if (sourceUsdValue > 0 && targetUsdValue > 0) {
        // Convert: (source amount * source USD value) / target USD value
        const result = (parseFloat(text1) * sourceUsdValue) / targetUsdValue;
        console.log("Conversion result:", result);
        settext2(result);
        setUnits(popularCryptos.find(c => c.id === value2)?.symbol || '');
      }
    } catch (error) {
      console.error("Conversion error:", error);
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    const tempValue = value1;
    setvalue1(value2);
    setvalue2(tempValue);
    settext1(text2.toString());
    settext2(0);
    setUnits("");
  };

  const getThemeClasses = () => {
    switch (theme) {
      case "light":
        return {
          container: "bg-white border-gray-300 text-gray-800 shadow-lg",
          title: "text-gray-900",
          subtitle: "text-gray-600",
          label: "text-gray-700",
          select: "bg-white border-gray-400 text-gray-900 focus:ring-blue-500 focus:border-blue-500",
          input: "bg-white border-gray-400 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500",
          result: "bg-gray-50 border-gray-300 text-gray-900",
          swap: "bg-gray-100 hover:bg-gray-200 text-gray-700",
          option: "text-gray-900 bg-white",
          info: "text-gray-500",
          icon: "text-gray-500"
        };
      default: // dark
        return {
          container: "glass-card",
          title: "text-white",
          subtitle: "text-secondary-400",
          label: "text-secondary-400",
          select: "bg-white/10 border-white/20 text-white focus:ring-primary-500 focus:border-transparent",
          input: "bg-white/10 border-white/20 text-white placeholder-secondary-400 focus:ring-primary-500 focus:border-transparent",
          result: "bg-white/5 border-white/10 text-white",
          swap: "bg-white/10 hover:bg-white/20 text-white",
          option: "text-gray-600 bg-gray-800",
          info: "text-secondary-500",
          icon: "text-secondary-400"
        };
    }
  };

  const classes = getThemeClasses();

  return (
    <div className={`${classes.container} p-6`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-display font-bold mb-1 ${classes.title}`}>
            Currency Exchange
          </h3>
          <p className={`text-sm ${classes.subtitle}`}>
            Convert between cryptocurrencies
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchExchangeRates}
            className={`p-1 rounded transition-colors ${classes.swap}`}
            title="Refresh rates"
          >
            <svg className={`w-4 h-4 ${classes.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
            <span className={`text-xs font-medium ${classes.subtitle}`}>Live Rates</span>
          </div>
        </div>
      </div>

      {/* Exchange Form */}
      <div className="space-y-6">
        {/* From Currency */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${classes.label}`}>
            From
          </label>
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <select
                value={value1}
                onChange={(e) => setvalue1(e.target.value)}
                className={`w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 appearance-none cursor-pointer ${classes.select}`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.75rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                {cryptoList.map((crypto, k) => (
                  <option key={k} value={crypto.id} className={classes.option}>
                    {crypto.name} ({crypto.symbol})
                  </option>
                ))}
              </select>
            </div>
            <div className="w-24">
              <input
                type="number"
                placeholder="0.00"
                value={text1 || ""}
                onChange={(e) => settext1(e.target.value)}
                className={`w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${classes.input}`}
              />
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={swapCurrencies}
            className={`p-2 rounded-full transition-colors ${classes.swap}`}
            title="Swap currencies"
          >
            <svg className={`w-5 h-5 ${classes.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* To Currency */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${classes.label}`}>
            To
          </label>
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <select
                value={value2}
                onChange={(e) => setvalue2(e.target.value)}
                className={`w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 appearance-none cursor-pointer ${classes.select}`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.75rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                {cryptoList.map((crypto, k) => (
                  <option key={k} value={crypto.id} className={classes.option}>
                    {crypto.name} ({crypto.symbol})
                  </option>
                ))}
              </select>
            </div>
            <div className="w-24">
              <div className={`w-full rounded-lg px-4 py-3 ${classes.result}`}>
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <span className="text-sm">
                    {text2 > 0 ? parseFloat(text2).toFixed(6) : "0.000000"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Result Display */}
        {text2 > 0 && units && (
          <div className="bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${classes.subtitle}`}>Exchange Rate</p>
                <p className={`text-lg font-semibold ${classes.title}`}>
                  {parseFloat(text2).toFixed(6)} {units}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-xs ${classes.subtitle}`}>Rate</p>
                <p className="text-sm font-medium text-primary-400">
                  1 {cryptoList.find(c => c.id === value1)?.symbol} = {exchangeRates[value1] && exchangeRates[value2] ? 
                    ((exchangeRates[value2].usd / exchangeRates[value1].usd)).toFixed(6) : '0.000000'} {cryptoList.find(c => c.id === value2)?.symbol}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Convert Button */}
        <button
          onClick={convert}
          disabled={!text1 || loading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Converting...</span>
            </div>
          ) : (
            "Convert Currency"
          )}
        </button>
      </div>

      {/* Exchange Info */}
      <div className={`mt-6 pt-4 border-t ${theme === 'light' ? 'border-gray-200' : 'border-white/10'}`}>
        <div className={`flex items-center justify-between text-xs ${classes.info}`}>
          <span>Powered by CoinGecko API</span>
          <span>Rates update every minute</span>
        </div>
      </div>
    </div>
  );
};