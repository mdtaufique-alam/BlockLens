import React, { useEffect, useContext, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { CryptoContext } from "../context/CryptoContext";
import { API_CONFIG } from "../config/api";

Chart.register(...registerables);

// Modern chart component with enhanced UX and professional styling
export const CryptoChart = () => {
  const { currency, cryptoId, selectedCoinForChart } = useContext(CryptoContext);
  const [chartData, setChartData] = useState([]);
  const [days, setDays] = useState(7);
  const [id, setId] = useState("bitcoin");
  const [interval, setInterval] = useState("daily");
  const [chartType, setChartType] = useState("LineChart");
  const [loading, setLoading] = useState(false);

  // Update chart when a coin is selected from search
  useEffect(() => {
    if (selectedCoinForChart && selectedCoinForChart !== id) {
      console.log("Search selected coin:", selectedCoinForChart, "Current chart ID:", id);
      setId(selectedCoinForChart);
    }
  }, [selectedCoinForChart, id]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        setChartData([]); // Clear previous data
        console.log(`Fetching chart data for ${id} in ${currency} for ${days} days`);
        
        const url = API_CONFIG.addApiKey(
          `${API_CONFIG.BASE_URL}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}&interval=${interval}`
        );
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Chart data received:", data);
        
        if (data.prices && data.prices.length > 0) {
        setChartData(data.prices);
        } else {
          console.warn("No price data received");
          setChartData([]);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    if (id && currency) {
      fetchChartData();
    }
  }, [days, id, currency, interval]);

  const ChartData = chartData && chartData.length > 0 ? chartData.map((value) => ({
    x: value[0],
    y: value[1].toFixed(2),
  })) : [];

  const timeRanges = [
    { label: "1D", value: 1, interval: "hourly" },
    { label: "1W", value: 7, interval: "daily" },
    { label: "1M", value: 30, interval: "daily" },
    { label: "6M", value: 180, interval: "monthly" },
    { label: "1Y", value: 365, interval: "yearly" },
  ];

  const chartTypes = [
    { label: "Line Chart", value: "LineChart" },
    { label: "Bar Chart", value: "BarChart" },
    { label: "Horizontal Bar", value: "BarChartH" },
  ];

  const handleTimeRange = (range) => {
    setDays(range.value);
    setInterval(range.interval);
  };

  const formatLabel = (val) => {
    const date = new Date(val.x);
    if (days === 1) {
      return date.getHours() > 12
        ? `${date.getHours() - 12}:${date.getMinutes().toString().padStart(2, '0')}PM`
        : `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}AM`;
    }
    return date.toLocaleDateString("default", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        align: "end",
        labels: {
          color: "white",
          pointStyleWidth: 15,
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: {
            size: 12,
            weight: '500'
          }
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${id.toUpperCase()}: $${context.parsed.y}`;
          }
        }
      }
    },
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
          maxTicksLimit: 8,
          color: "white",
                      font: {
            size: 11
          }
                    },
                  },
                  y: {
                    grid: {
          color: 'rgba(255, 255, 255, 0.1)',
                      drawBorder: false,
                    },
        ticks: {
          color: "white",
          font: {
            size: 11
          },
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
                    }
                  },
                },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 6,
      },
      line: {
        tension: 0.1,
        borderWidth: 2,
      }
    }
  };

  const barOptions = {
    ...chartOptions,
    indexAxis: chartType === "BarChartH" ? "y" : "x",
    elements: {
      bar: {
        borderRadius: 4,
        borderSkipped: false,
      },
    },
  };

  return (
    <div className="glass-card p-6 relative z-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl font-display font-bold text-white mb-1">
            Price Chart
          </h2>
          <p className="text-sm text-secondary-400">
            {id.toUpperCase()} in {currency.toUpperCase()}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Time Range Buttons */}
          <div className="flex bg-white/10 rounded-lg p-1">
            {timeRanges.map((range) => (
              <button
                key={range.label}
                onClick={() => handleTimeRange(range)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                  days === range.value
                    ? "bg-primary-500 text-white shadow-glow"
                    : "text-secondary-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Chart Type Selector */}
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '2.5rem'
            }}
          >
            {chartTypes.map((type) => (
              <option key={type.value} value={type.value} className="text-gray-600 bg-gray-800">
                {type.label}
              </option>
            ))}
          </select>

          {/* Crypto Selector */}
          <select
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-w-32 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '2.5rem'
            }}
          >
            {cryptoId && Array.isArray(cryptoId) && cryptoId.map((d, k) => (
              <option key={k} value={d.id} className="text-gray-600 bg-gray-800">
                {d.id.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative">
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-secondary-400 text-sm">Loading chart data...</p>
            </div>
          </div>
        ) : ChartData.length === 0 ? (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-secondary-400 text-sm">No chart data available</p>
              <p className="text-xs text-secondary-500 mt-1">Try selecting a different cryptocurrency</p>
            </div>
          </div>
        ) : (
          <div className="h-80">
            {chartType === "LineChart" ? (
              <Line
              data={{
                  labels: ChartData.map(formatLabel),
                datasets: [
                  {
                      id: 1,
                      label: `${id.toUpperCase()} Price`,
                    data: ChartData.map((val) => val.y),
                      borderColor: "#3b82f6",
                      backgroundColor: "rgba(59, 130, 246, 0.1)",
                      fill: true,
                      tension: 0.1,
                  },
                ],
              }}
                options={chartOptions}
              />
            ) : (
            <Bar
              data={{
                  labels: ChartData.map(formatLabel),
                datasets: [
                  {
                      label: `${id.toUpperCase()} Price`,
                    data: ChartData.map((val) => val.y),
                      backgroundColor: "rgba(59, 130, 246, 0.8)",
                      borderColor: "#3b82f6",
                      borderWidth: 1,
                  },
                ],
              }}
                options={barOptions}
              />
            )}
          </div>
        )}
      </div>

      {/* Chart Info */}
      <div className="mt-4 flex items-center justify-between text-xs text-secondary-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
            <span>Price</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span>Volume</span>
          </div>
        </div>
        <div className="text-right">
          <p>Data provided by CoinGecko</p>
        </div>
      </div>
    </div>
  );
};