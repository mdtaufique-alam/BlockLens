import React, { useContext, useState, useEffect } from 'react';
import { CryptoContext } from '../context/CryptoContext';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { API_CONFIG } from '../config/api';

Chart.register(...registerables);

const BEXETDashboard = () => {
  const { cryptoData, currency } = useContext(CryptoContext);
  const [selectedTimeframe, setSelectedTimeframe] = useState('Daily');
  const [portfolioBalance] = useState(12852.23);
  const [balanceChange] = useState({ percentage: 16.3, direction: 'up' });
  const [loading, setLoading] = useState(true);
  const [sparklineData, setSparklineData] = useState({});


  // Fetch sparkline data for cryptocurrencies
  useEffect(() => {
    const fetchSparklineData = async () => {
      try {
        if (cryptoData && cryptoData.length > 0) {
          const cryptoIds = cryptoData.slice(0, 10).map(crypto => crypto.id).join(',');
          const response = await fetch(
            `${API_CONFIG.BASE_URL}/coins/markets?vs_currency=${currency}&ids=${cryptoIds}&sparkline=true&x_cg_demo_api_key=${API_CONFIG.API_KEY}`
          );
          
          if (response.ok) {
            const data = await response.json();
            const sparklineMap = {};
            data.forEach(crypto => {
              sparklineMap[crypto.id] = crypto.sparkline_in_7d?.price || [];
            });
            setSparklineData(sparklineMap);
          }
        } else {
          // If no cryptoData, still set loading to false
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching sparkline data:', error);
        setLoading(false);
      }
    };

    // Set a timeout to ensure loading state is cleared
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    fetchSparklineData();

    return () => clearTimeout(timeout);
  }, [cryptoData, currency]);

  // Mock data for demonstration - in real app, this would come from API
  const mockBalanceData = {
    Daily: [
      { time: "8 PM", value: 1850 },
      { time: "8:30 PM", value: 1920 },
      { time: "9 PM", value: 1780 },
      { time: "9:30 PM", value: 1950 },
      { time: "10 PM", value: 2010 },
      { time: "10:30 PM", value: 1890 },
      { time: "11 PM", value: 2100 },
      { time: "11:30 PM", value: 2050 },
      { time: "12 PM", value: 1980 },
      { time: "12:30 AM", value: 2150 },
      { time: "1 AM", value: 2080 },
      { time: "1:30 AM", value: 2200 },
      { time: "2 AM", value: 2120 },
      { time: "2:30 AM", value: 2050 },
      { time: "3 AM", value: 2180 },
      { time: "3:30 AM", value: 2250 },
      { time: "4 AM", value: 2300 },
      { time: "4:30 AM", value: 2180 },
      { time: "5 AM", value: 2350 },
      { time: "5:30 AM", value: 2280 },
      { time: "6 AM", value: 2420 },
      { time: "6:30 AM", value: 2380 },
      { time: "7 AM", value: 2450 },
      { time: "7:30 AM", value: 2500 },
      { time: "8 AM", value: 2567 },
      { time: "8:30 AM", value: 2480 },
      { time: "9 AM", value: 2520 },
      { time: "9:30 AM", value: 2450 },
      { time: "10 AM", value: 2380 },
      { time: "10:30 AM", value: 2420 },
      { time: "11 AM", value: 2350 },
      { time: "11:30 AM", value: 2400 },
      { time: "12 AM", value: 2320 },
      { time: "12:30 PM", value: 2380 },
      { time: "1 PM", value: 2280 },
      { time: "1:30 PM", value: 2350 },
      { time: "2 PM", value: 2250 },
      { time: "2:30 PM", value: 2320 },
      { time: "3 PM", value: 2180 },
      { time: "3:30 PM", value: 2280 },
      { time: "4 PM", value: 2150 },
      { time: "4:30 PM", value: 2220 }
    ]
  };

  const assetShares = [
    { symbol: "BTC", name: "Bitcoin", percentage: 36, color: "#F7931A" },
    { symbol: "ETH", name: "Ethereum", percentage: 26, color: "#627EEA" },
    { symbol: "XRP", name: "XRP", percentage: 23, color: "#23292F" },
    { symbol: "USDT", name: "Tether", percentage: 9, color: "#26A17B" },
    { symbol: "SOL", name: "Solana", percentage: 6, color: "#9945FF" }
  ];

  const sidebarItems = [
    { id: "home", label: "Home", icon: "🏠", active: true },
    { id: "transactions", label: "Transactions", icon: "💳", active: false },
    { id: "performance", label: "Performance", icon: "📊", active: false },
    { id: "user-management", label: "User Management", icon: "👥", active: false },
    { id: "pair-management", label: "Pair Management", icon: "🔗", active: false },
    { id: "security", label: "Security", icon: "🛡️", active: false },
    { id: "settings", label: "Settings", icon: "⚙️", active: false, position: "bottom" }
  ];

  const timeframes = ["Daily", "Weekly", "Monthly"];

  const chartData = {
    labels: mockBalanceData[selectedTimeframe]?.map(item => item.time) || [],
    datasets: [
      {
        label: 'Portfolio Value',
        data: mockBalanceData[selectedTimeframe]?.map(item => item.value) || [],
        borderColor: '#F7931A',
        backgroundColor: 'rgba(247, 147, 26, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: '#F7931A',
        pointHoverBorderColor: '#FFFFFF',
        pointHoverBorderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#F7931A',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context) {
            return `Time: ${context[0].label}`;
          },
          label: function(context) {
            return `Value: $${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 12
          }
        }
      },
      y: {
        display: true,
        grid: {
          color: '#2A2D35',
          drawBorder: false
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 12
          },
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  // Sparkline component
  const SparklineChart = ({ data, isPositive }) => {
    if (!data || data.length === 0) {
      return (
        <div className="w-16 h-8 bg-[#2A2D35] rounded flex items-center justify-center">
          <span className="text-xs text-[#9CA3AF]">📈</span>
        </div>
      );
    }

    const sparklineData = {
      labels: data.map((_, index) => index),
      datasets: [
        {
          data: data,
          borderColor: isPositive ? '#10B981' : '#EF4444',
          backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          borderWidth: 1.5,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 0
        }
      ]
    };

    const sparklineOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      scales: {
        x: { display: false },
        y: { display: false }
      },
      elements: {
        point: { radius: 0 }
      }
    };

    return (
      <div className="w-16 h-8">
        <Line data={sparklineData} options={sparklineOptions} />
      </div>
    );
  };

  // Show loading only for a short time
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0B0D] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#F7931A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#9CA3AF] text-lg">Loading BEXET Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-64 bg-gray-800 lg:min-h-screen border-b lg:border-b-0 lg:border-r border-gray-700">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-8">BEXET</h1>
            <nav className="space-y-2 flex lg:flex-col overflow-x-auto lg:overflow-x-visible">
              {sidebarItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors whitespace-nowrap ${
                    item.active 
                      ? 'bg-[#F7931A] text-white' 
                      : 'text-[#9CA3AF] hover:text-white hover:bg-[#1A1C22]'
                  } ${item.position === 'bottom' ? 'mt-auto' : ''}`}
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Good morning, Wilson</h2>
            <p className="text-[#9CA3AF]">Welcome back to your portfolio dashboard</p>
          </div>

          {/* Portfolio Summary */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 mb-8">
            {/* Portfolio Balance Card */}
            <div className="xl:col-span-2 bg-gray-800 rounded-xl p-4 lg:p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Portfolio Balance</h3>
                <div className="flex space-x-2">
                  {timeframes.map((timeframe) => (
                    <button
                      key={timeframe}
                      onClick={() => setSelectedTimeframe(timeframe)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        selectedTimeframe === timeframe
                          ? 'bg-[#F7931A] text-white'
                          : 'text-[#9CA3AF] hover:text-white hover:bg-[#1A1C22]'
                      }`}
                    >
                      {timeframe}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <div className="text-4xl font-bold text-white mb-2">
                  ${portfolioBalance.toLocaleString()}
                </div>
                <div className={`flex items-center text-lg ${
                  balanceChange.direction === 'up' ? 'text-[#10B981]' : 'text-[#EF4444]'
                }`}>
                  <span className="mr-1">
                    {balanceChange.direction === 'up' ? '↗' : '↘'}
                  </span>
                  {balanceChange.percentage}%
                </div>
              </div>

              {/* Balance Chart */}
              <div className="h-64">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Asset Distribution */}
            <div className="bg-gray-800 rounded-xl p-4 lg:p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-6">Shares of Assets</h3>
              <div className="space-y-4">
                {assetShares.map((asset, index) => (
                  <div key={asset.symbol} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: asset.color }}
                        ></div>
                        <span className="text-white font-medium">{asset.symbol}</span>
                      </div>
                      <span className="text-[#9CA3AF]">{asset.percentage}%</span>
                    </div>
                    <div className="w-full bg-[#2A2D35] rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${asset.percentage}%`,
                          backgroundColor: asset.color 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cryptocurrency Table */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white">Cryptocurrency Overview</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#9CA3AF]">Asset Name</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#9CA3AF]">Current Price</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#9CA3AF]">Change</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#9CA3AF]">Market Cap</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#9CA3AF]">Volume</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#9CA3AF]">Supply</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#9CA3AF]">Chart</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#9CA3AF]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {cryptoData && cryptoData.length > 0 ? cryptoData.slice(0, 10).map((crypto, index) => (
                    <tr key={crypto.id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-xs font-bold text-white">
                              {crypto.symbol?.charAt(0) || '?'}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-medium">{crypto.name}</div>
                            <div className="text-[#9CA3AF] text-sm">{crypto.symbol?.toUpperCase()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white font-medium">
                        ${crypto.current_price?.toLocaleString() || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${
                          crypto.price_change_percentage_24h >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'
                        }`}>
                          {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                          {crypto.price_change_percentage_24h?.toFixed(2) || '0.00'}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#9CA3AF]">
                        ${(crypto.market_cap / 1000000000).toFixed(1)}B
                      </td>
                      <td className="px-6 py-4 text-[#9CA3AF]">
                        ${(crypto.total_volume / 1000000000).toFixed(1)}B
                      </td>
                      <td className="px-6 py-4 text-[#9CA3AF]">
                        {(crypto.circulating_supply / 1000000).toFixed(1)}M
                      </td>
                      <td className="px-6 py-4">
                        <SparklineChart 
                          data={sparklineData[crypto.id]} 
                          isPositive={crypto.price_change_percentage_24h >= 0}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <button className="bg-[#F7931A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#E8821A] transition-colors">
                          Trade
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-[#9CA3AF]">
                        Loading cryptocurrency data...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BEXETDashboard;
