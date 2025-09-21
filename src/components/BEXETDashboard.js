import React, { useState, useEffect, useContext } from 'react';
import { CryptoContext } from '../context/CryptoContext';
import { DashboardModeToggle } from './DashboardModeToggle';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const BexetDashboard = () => {
  const { theme } = useContext(CryptoContext);
  const [portfolioData, setPortfolioData] = useState({
    balance: 12852.23,
    change: 16.3,
    direction: 'up'
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState('Daily');
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [chartData, setChartData] = useState(null);

  // Mock data for portfolio chart
  const portfolioChartData = {
    labels: ['8 PM', '12 PM', '2 AM', '4 AM', '6 AM', '8 AM', '10 AM', '12 AM', '2 PM', '4 PM'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: [1850, 1920, 1780, 1950, 2010, 1890, 2100, 2050, 1980, 2150, 2080, 2200, 2120, 2050, 2180, 2250, 2300, 2180, 2350, 2280, 2420, 2380, 2450, 2500, 2567, 2480, 2520, 2450, 2380, 2420, 2350, 2400, 2320, 2380, 2280, 2350, 2250, 2320, 2180, 2280, 2150, 2220],
        borderColor: theme === 'light' ? '#3B82F6' : '#60A5FA',
        backgroundColor: theme === 'light' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(96, 165, 250, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        borderWidth: 2
      }
    ]
  };

  // Asset distribution data
  const assetShares = [
    { symbol: 'BTC', name: 'Bitcoin', percentage: 36, color: '#F7931A' },
    { symbol: 'ETH', name: 'Ethereum', percentage: 26, color: '#627EEA' },
    { symbol: 'XRP', name: 'XRP', percentage: 23, color: '#23292F' },
    { symbol: 'USDT', name: 'Tether', percentage: 9, color: '#26A17B' },
    { symbol: 'SOL', name: 'Solana', percentage: 6, color: '#9945FF' }
  ];

  // Fetch crypto data from API
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setLoading(true);
        console.log('Fetching crypto data...');
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=true');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Crypto data received:', data);
        
        const formattedData = data.map(coin => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          currentPrice: coin.current_price,
          change: {
            percentage: coin.price_change_percentage_24h || 0,
            direction: (coin.price_change_percentage_24h || 0) >= 0 ? 'up' : 'down'
          },
          marketCap: formatNumber(coin.market_cap),
          volume: formatNumber(coin.total_volume),
          supply: formatNumber(coin.circulating_supply),
          sparklineData: coin.sparkline_in_7d?.price || [],
          action: 'Trade'
        }));
        
        console.log('Formatted data:', formattedData);
        setCryptoData(formattedData);
        
        // Set first crypto as default selected
        if (formattedData.length > 0) {
          setSelectedCrypto(formattedData[0]);
        }
      } catch (error) {
        console.error('Error fetching crypto data:', error);
        // Set fallback data if API fails
        const fallbackData = [
          {
            id: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'BTC',
            currentPrice: 96527.99,
            change: { percentage: 0.66, direction: 'up' },
            marketCap: '1.9T',
            volume: '38.9B',
            supply: '19.8B',
            sparklineData: [],
            action: 'Trade'
          },
          {
            id: 'ethereum',
            name: 'Ethereum',
            symbol: 'ETH',
            currentPrice: 3462.60,
            change: { percentage: 0.58, direction: 'up' },
            marketCap: '418.6B',
            volume: '19.48B',
            supply: '120.5M',
            sparklineData: [],
            action: 'Trade'
          }
        ];
        setCryptoData(fallbackData);
        setSelectedCrypto(fallbackData[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();
  }, []);

  // Fetch chart data for selected crypto
  useEffect(() => {
    const fetchChartData = async () => {
      if (!selectedCrypto) return;
      
      try {
        console.log('Fetching chart data for:', selectedCrypto.symbol);
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${selectedCrypto.id}/market_chart?vs_currency=usd&days=1&interval=hourly`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Chart data received:', data);
        
        if (data.prices && data.prices.length > 0) {
          const chartData = {
            labels: data.prices.map((_, index) => {
              const hour = index * 2; // Every 2 hours
              const time = new Date();
              time.setHours(time.getHours() - (24 - hour));
              return time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
            }),
            datasets: [{
              label: `${selectedCrypto.symbol} Price`,
              data: data.prices.map(price => price[1]),
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 6,
              borderWidth: 2
            }]
          };
          setChartData(chartData);
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
        // Use fallback chart data
        const fallbackChartData = {
          labels: ['8 PM', '12 PM', '2 AM', '4 AM', '6 AM', '8 AM', '10 AM', '12 AM', '2 PM', '4 PM'],
          datasets: [{
            label: `${selectedCrypto.symbol} Price`,
            data: [1850, 1920, 1780, 1950, 2010, 1890, 2100, 2050, 1980, 2150, 2080, 2200],
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            borderWidth: 2
          }]
        };
        setChartData(fallbackChartData);
      }
    };

    fetchChartData();
  }, [selectedCrypto]);

  // Handle crypto selection
  const handleCryptoSelect = (crypto) => {
    setSelectedCrypto(crypto);
  };

  const formatNumber = (num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toFixed(2);
  };

  const getThemeClasses = () => {
    return {
      container: 'bg-gray-50 text-gray-900',
      card: 'bg-white border border-gray-200 shadow-sm rounded-lg',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-500',
      border: 'border-gray-200',
      button: 'bg-gray-900 text-white hover:bg-gray-800 rounded-lg',
      buttonSecondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 rounded-lg',
      buttonActive: 'bg-gray-900 text-white border-b-2 border-gray-900',
      positive: 'text-green-600',
      negative: 'text-red-600',
      sidebar: 'bg-gray-100',
      sidebarActive: 'bg-gray-900 text-white',
      sidebarInactive: 'text-gray-600 hover:text-gray-900'
    };
  };

  const classes = getThemeClasses();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(31, 41, 55, 0.95)',
        titleColor: theme === 'light' ? '#1F2937' : '#F9FAFB',
        bodyColor: theme === 'light' ? '#1F2937' : '#F9FAFB',
        borderColor: theme === 'light' ? '#E5E7EB' : '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      }
    },
    elements: {
      point: {
        hoverBackgroundColor: theme === 'light' ? '#3B82F6' : '#60A5FA'
      }
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${classes.container}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={classes.textSecondary}>Loading BEXET Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${classes.container}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">BEXET</h1>
          </div>
          <div className="flex items-center space-x-6">
            {/* Dashboard Mode Toggle */}
            <DashboardModeToggle />
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, Wilson
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 00-15 0v5h5l-5 5-5-5h5v-5a7.5 7.5 0 0115 0v5z" />
                </svg>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm font-medium">W</span>
              </div>
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 bg-gray-50">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Shares of Assets - Upper Left */}
          <div className={`${classes.card} p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${classes.text}`}>Shares of assets</h3>
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </div>
            <div className="space-y-4">
              {assetShares.map((asset) => (
                <div key={asset.symbol} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${classes.text}`}>{asset.symbol}</span>
                    <span className={`text-sm ${classes.textSecondary}`}>{asset.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${asset.percentage}%`,
                        backgroundColor: asset.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Chart - Middle */}
          <div className={`${classes.card} p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${classes.text}`}>
                {selectedCrypto ? `${selectedCrypto.symbol} Price Chart` : 'Dynamics of the balance'}
              </h3>
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </div>
            <div className="h-40">
              {chartData ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <Line data={portfolioChartData} options={chartOptions} />
              )}
            </div>
          </div>

          {/* Portfolio Balance - Upper Right */}
          <div className={`${classes.card} p-6`}>
            <h3 className={`text-lg font-semibold mb-4 ${classes.text}`}>My balance</h3>
            <div className="mb-4">
              <p className={`text-3xl font-bold ${classes.text}`}>
                ${portfolioData.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium bg-gray-900 text-white px-2 py-1 rounded ${classes.positive}`}>
                  ↑ +{portfolioData.change}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Time Period Section */}
        <div className="mb-6">
          <div className={`${classes.card} p-6`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${classes.text}`}>Time Period</h3>
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  {['Daily', 'Weekly', 'Monthly'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedTimeframe(period)}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        selectedTimeframe === period
                          ? `${classes.buttonActive}`
                          : `${classes.textSecondary} hover:${classes.text}`
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
                <button className={`px-4 py-2 rounded-lg text-sm font-medium ${classes.buttonSecondary}`}>
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cryptocurrency Table */}
        <div className={`${classes.card} p-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${classes.text}`}>Cryptocurrency Market</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${classes.border}`}>
                  <th className={`text-left py-3 px-4 ${classes.textSecondary} text-sm font-medium`}>Asset Name</th>
                  <th className={`text-right py-3 px-4 ${classes.textSecondary} text-sm font-medium`}>Current Price</th>
                  <th className={`text-right py-3 px-4 ${classes.textSecondary} text-sm font-medium`}>Change</th>
                  <th className={`text-right py-3 px-4 ${classes.textSecondary} text-sm font-medium`}>Market cap</th>
                  <th className={`text-right py-3 px-4 ${classes.textSecondary} text-sm font-medium`}>Volume</th>
                  <th className={`text-right py-3 px-4 ${classes.textSecondary} text-sm font-medium`}>Supply</th>
                  <th className={`text-right py-3 px-4 ${classes.textSecondary} text-sm font-medium`}>Chart</th>
                  <th className={`text-right py-3 px-4 ${classes.textSecondary} text-sm font-medium`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {cryptoData.slice(0, 5).map((crypto) => (
                  <tr 
                    key={crypto.id} 
                    className={`border-b ${classes.border} hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedCrypto?.id === crypto.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => handleCryptoSelect(crypto)}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-600">{crypto.symbol[0]}</span>
                        </div>
                        <div>
                          <div className={`font-medium ${classes.text}`}>{crypto.symbol}</div>
                          <div className={`text-xs ${classes.textMuted}`}>{crypto.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className={`text-right py-4 px-4 ${classes.text} font-medium`}>
                      ${crypto.currentPrice.toLocaleString()}
                    </td>
                    <td className={`text-right py-4 px-4 ${
                      crypto.change.direction === 'up' ? classes.positive : classes.negative
                    } font-medium`}>
                      {crypto.change.direction === 'up' ? '+' : ''}{crypto.change.percentage.toFixed(2)}%
                    </td>
                    <td className={`text-right py-4 px-4 ${classes.text}`}>
                      {crypto.marketCap}
                    </td>
                    <td className={`text-right py-4 px-4 ${classes.text}`}>
                      {crypto.volume}
                    </td>
                    <td className={`text-right py-4 px-4 ${classes.text}`}>
                      {crypto.supply}
                    </td>
                    <td className="text-right py-4 px-4">
                      <div className="w-16 h-8 bg-gray-200 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </td>
                    <td className="text-right py-4 px-4">
                      <button 
                        className={`px-4 py-2 rounded text-sm font-medium ${classes.buttonSecondary} hover:bg-orange-200`}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Trade clicked for', crypto.symbol);
                        }}
                      >
                        Trade
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};