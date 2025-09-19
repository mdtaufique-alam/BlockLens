import React from 'react'
import { useState, useEffect } from 'react'

export const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <header className="w-full bg-gradient-to-r from-primary-900/20 to-accent-900/20 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-glow">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
                  <h1 className="text-2xl font-display font-bold text-gradient">
                    BlockLens
                  </h1>
                  <p className="text-sm text-secondary-400 font-medium">
                    Cryptocurrency Analytics Dashboard
                  </p>
            </div>
          </div>

          {/* Live Stats */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="text-center">
              <p className="text-xs text-secondary-400 uppercase tracking-wide">Live Time</p>
              <p className="text-sm font-mono font-semibold text-white">
                {currentTime.toLocaleTimeString()}
              </p>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <p className="text-xs text-secondary-400 uppercase tracking-wide">Status</p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <p className="text-sm font-semibold text-success">Live</p>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
