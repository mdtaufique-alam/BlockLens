// API Configuration
export const API_CONFIG = {
  // Replace this with your actual CoinGecko API key
  COINGECKO_API_KEY: process.env.REACT_APP_COINGECKO_API_KEY || '',
  BASE_URL: 'https://api.coingecko.com/api/v3',
  
  // Helper function to add API key to requests
  addApiKey: (url) => {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}x_cg_demo_api_key=${API_CONFIG.COINGECKO_API_KEY}`;
  }
};

export default API_CONFIG;
