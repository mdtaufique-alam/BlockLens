import { createContext, useLayoutEffect, useState, useCallback } from "react";
import { API_CONFIG } from "../config/api";

//create context object
export const CryptoContext = createContext({});

/*cryptoContext component contains api data of cryptocoins,
 cryptoId and search cryptos and there states as well
*/
export const CryptoProvider = ({ children }) => {
  const [cryptoId, setCryptoId] = useState();
  const [cryptoData, setCryptoData] = useState();
  const [currency, setCurrency] = useState("usd");
  const [sortBy, setSortBy] = useState("market_cap_desc");
  const [page, setPage] = useState(1);
  const [totalPages] = useState(350);
  const [perPage, setPerPage] = useState(8);
  const [searchData, setSearchData] = useState();
  const [coinSearch, setCoinSearch] = useState("");
  const [selectedCoinForChart, setSelectedCoinForChart] = useState("");
  const [theme, setTheme] = useState("dark"); // dark, light, minimalist
  // removed BEXET mode
 
  const getCryptoData = useCallback(async () => {
    try {
      const url = API_CONFIG.addApiKey(
        `${API_CONFIG.BASE_URL}/coins/markets?vs_currency=${currency}&ids=${coinSearch}&order=${sortBy}&page=${page}&per_page=${perPage}`
      );
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCryptoData(data);
    } catch (error) {
      console.error("Error fetching crypto data:", error);
      setCryptoData([]);
    }
  }, [currency, coinSearch, sortBy, page, perPage]);

  const getCryptoId = useCallback(async () => {
    try {
      // Get a list of popular cryptocurrencies for the chart dropdown
      const url = API_CONFIG.addApiKey(
        `${API_CONFIG.BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&page=1&per_page=50`
      );
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCryptoId(data);
    } catch (error) {
      console.error("Error fetching crypto ID data:", error);
      setCryptoId([]);
    }
  }, [currency]);


  const getSearchResult = async (query) => {
    try {
      const url = API_CONFIG.addApiKey(
        `${API_CONFIG.BASE_URL}/search?query=${query}`
      );
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSearchData(data.coins || []);
    } catch (error) {
      console.error("Error fetching search data:", error);
      setSearchData([]);
    }
  };

  const resetFunction = () => {
    setPage(1);
    setCoinSearch("");
    setSortBy("market_cap_desc");
  };

  useLayoutEffect(() => {
    getCryptoData();
  }, [getCryptoData]);

  useLayoutEffect(() => {
    getCryptoId();
  }, [getCryptoId]);

  return (
    <CryptoContext.Provider
      value={{
        cryptoData,
        currency,
        setCurrency,
        sortBy,
        setSortBy,
        page,
        setPage,
        totalPages,
        setPerPage,
        perPage,
        searchData,
        getSearchResult,
        setCoinSearch,
        setSearchData,
        resetFunction,
        cryptoId,
        coinSearch,
        selectedCoinForChart,
        setSelectedCoinForChart,
        theme,
        setTheme
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};
