import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import BEXETDashboard from "./components/BEXETDashboard";
import { CryptoProvider } from "./context/CryptoContext";

//App is the parent component of dashboard

function App() {

  return (
    <Provider store={store}>
      <CryptoProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            {/* Navigation Header */}
            <nav className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <h1 className="text-xl font-bold text-gray-900">BlockLens</h1>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link 
                      to="/" 
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    >
                      Original Dashboard
                    </Link>
                    <Link 
                      to="/bexet" 
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    >
                      BEXET Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </nav>

            {/* Main Content */}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/bexet" element={<BEXETDashboard />} />
            </Routes>
          </div>
        </Router>
      </CryptoProvider>
    </Provider>
  );
}

export default App;
