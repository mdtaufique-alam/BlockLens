import React, { useState, useEffect, useContext } from "react";
import { Chart, registerables } from "chart.js";
import { Pie } from "react-chartjs-2";
import { CryptoContext } from "../context/CryptoContext";

Chart.register(...registerables);

const getChartOptions = (theme) => {
  const isLight = theme === 'light';
  
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: isLight ? '#374151' : 'white',
          pointStyleWidth: 12,
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
        backgroundColor: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.8)',
        titleColor: isLight ? '#111827' : 'white',
        bodyColor: isLight ? '#374151' : 'white',
        borderColor: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${(value / 1000000000).toFixed(1)}B (${percentage}%)`;
          }
        }
      }
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
      }
    }
  };
};

export const Portfolio = () => {
  const { theme } = useContext(CryptoContext);
  const [totalVolume, setTotalVolume] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    labels: ["Bitcoin", "Ethereum", "Tether"],
    datasets: [
      {
        label: "Market Cap",
        data: [0, 0, 0],
        backgroundColor: [
          "#f59e0b",
          "#3b82f6", 
          "#10b981"
        ],
        borderColor: [
          "#f59e0b",
          "#3b82f6",
          "#10b981"
        ],
        borderWidth: 2,
        hoverOffset: 8,
        hoverBorderWidth: 3,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=tether%2Cethereum%2Cbitcoin&order=market_cap_desc`;
        const response = await fetch(url);
        const res = await response.json();
        
        const labelSet = [];
        const dataSet1 = [];
        
        for (const val of res) {
          dataSet1.push(val.market_cap);
          labelSet.push(val.name);
        }
        
        setData({
          labels: labelSet,
          datasets: [
            {
              label: "Market Cap",
              data: dataSet1,
              backgroundColor: [
                "#f59e0b",
                "#3b82f6", 
                "#10b981"
              ],
              borderColor: [
                "#f59e0b",
                "#3b82f6",
                "#10b981"
              ],
              borderWidth: 2,
              hoverOffset: 8,
              hoverBorderWidth: 3,
            },
          ],
        });
        
        setTotalVolume(
          dataSet1.reduce((partialSum, a) => partialSum + a, 0).toFixed(0)
        );
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getThemeClasses = () => {
    switch (theme) {
      case "light":
        return {
          container: "bg-white border-gray-300 text-gray-800 shadow-lg",
          title: "text-gray-900",
          subtitle: "text-gray-600",
          value: "text-gray-900",
          label: "text-gray-600",
          loading: "bg-gray-200"
        };
      default: // dark
        return {
          container: "glass-card",
          title: "text-white",
          subtitle: "text-secondary-400",
          value: "text-white",
          label: "text-secondary-400",
          loading: "bg-white/10"
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
            Portfolio Overview
          </h3>
          <p className={`text-sm ${classes.subtitle}`}>
            Top 3 Cryptocurrencies by Market Cap
          </p>
        </div>
        <div className="text-right">
          <p className={`text-xs uppercase tracking-wide ${classes.label}`}>Total Value</p>
          <p className={`text-2xl font-bold ${classes.value}`}>
            {loading ? (
              <div className={`w-24 h-8 rounded animate-pulse ${classes.loading}`}></div>
            ) : (
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "usd",
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(totalVolume)
            )}
          </p>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className={`text-sm ${classes.subtitle}`}>Loading portfolio data...</p>
            </div>
          </div>
        ) : (
          <div className="h-64">
            <Pie data={data} options={getChartOptions(theme)} />
          </div>
        )}
      </div>

      {/* Portfolio Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {data.labels.map((label, index) => {
          const value = data.datasets[0].data[index];
          const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          
          return (
            <div key={label} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
                ></div>
                <span className={`text-xs font-medium ${classes.subtitle}`}>
                  {label}
                </span>
              </div>
              <p className={`text-sm font-semibold ${classes.value}`}>
                {percentage}%
              </p>
              <p className={`text-xs ${classes.label}`}>
                ${(value / 1000000000).toFixed(1)}B
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};