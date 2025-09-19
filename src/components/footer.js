import React from 'react'

export const Footer = () => {
  return (
    <footer className="mt-16 border-t border-white/10 bg-gradient-to-r from-primary-900/10 to-accent-900/10 backdrop-blur-md">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Brand Section */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
                  <h3 className="text-lg font-display font-bold text-white">
                    BlockLens
                  </h3>
                  <p className="text-xs text-secondary-400">
                    Cryptocurrency Analytics Dashboard
                  </p>
            </div>
          </div>

          {/* Links Section */}
          <div className="flex items-center space-x-6">
            <a
              href="https://coingecko.com"
              className="text-sm text-secondary-400 hover:text-primary-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              CoinGecko API
            </a>
            <a
              href="https://reactjs.org"
              className="text-sm text-secondary-400 hover:text-primary-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              React
            </a>
            <a
              href="https://tailwindcss.com"
              className="text-sm text-secondary-400 hover:text-primary-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tailwind CSS
            </a>
          </div>

          {/* Data Attribution */}
          <div className="text-center md:text-right">
            <p className="text-xs text-secondary-500 mb-1">
              Data provided by
            </p>
            <div className="flex items-center justify-center md:justify-end space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="text-xs font-medium text-secondary-400">
                CoinGecko API
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
                <p className="text-xs text-secondary-500">
                  © 2024 BlockLens. Built with ❤️ by MD Taufique Alam for the crypto community.
                </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-xs text-success font-medium">Live Data</span>
              </div>
              <div className="text-xs text-secondary-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}