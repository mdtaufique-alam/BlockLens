import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoins } from "../redux/action/action";
import { CryptoChart } from "./CryptoChart";
import { ExchangeCoins } from "./ExchangeCoins";
import { SideBar } from "./SideBar";
import { Portfolio } from "./Portfolio";
import { SearchBar } from "./SearchBar";
import { Footer } from "./footer";
import { useState } from "react";
import Lottie from "lottie-react";
import { Header } from "./Header";
import * as bitcoin from "../assets/92445-crypto-bitcoin.json";
import * as success from "../assets/1127-success.json";

//Dashboard is the parent component 
function Dashboard() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.default);
  const [loading, setLoading] = useState(undefined);
  const [completed, setCompleted] = useState(undefined);

  useEffect(() => {
    // Start loading immediately
    setLoading(true);
    
    // Fetch coins if not already loaded
    if (data.coinList.length === 0) {
      dispatch(fetchCoins());
    }

    // Complete loading after a short delay
    const timer = setTimeout(() => {
      setCompleted(true);
    }, 2000);

    // Fallback timer in case something goes wrong
    const fallbackTimer = setTimeout(() => {
      console.log("Fallback: Force completing loading");
      setCompleted(true);
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, [data.coinList.length, dispatch]);

  // Debug logging
  console.log("Dashboard state:", { loading, completed, coinListLength: data.coinList.length });

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-100">
      {!completed ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-8">
              {!loading ? (
                <Lottie animationData={bitcoin} />
              ) : (
                <Lottie animationData={success} />
              )}
            </div>
                <h2 className="text-2xl font-display font-bold text-white mb-2">
                  {!loading ? "Initializing Dashboard..." : "Welcome to BlockLens"}
                </h2>
                <p className="text-secondary-400">
                  {!loading ? "Loading market data..." : "Your professional cryptocurrency analytics dashboard is ready!"}
                </p>
            <div className="mt-4 text-xs text-gray-500">
              Debug: Loading={loading?.toString()}, Completed={completed?.toString()}, Coins={data.coinList.length}
            </div>
          </div>
        </div>
      ) : (
        <>
          <Header />
          <main className="container mx-auto px-6 py-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content Area */}
              <div className="lg:col-span-3 space-y-8">
                <SearchBar />
                <CryptoChart />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Portfolio />
                  <ExchangeCoins />
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <SideBar />
              </div>
            </div>
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}

export default Dashboard;
