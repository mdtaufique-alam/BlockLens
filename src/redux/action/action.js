import axios from "axios";
import actionTypes from "./types";
import { API_CONFIG } from "../../config/api";

// fetchCoins action 
export const fetchCoins = () => {
      return (dispatch) => {
          const url = API_CONFIG.addApiKey(
            `${API_CONFIG.BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&page=1&per_page=9`
          );
          axios.get(url)
          .then(response =>{
              const data = response.data
              dispatch({
                type: actionTypes.COIN_API_SUCCESS,
                payload: data
              })
          })
          .catch(error =>{
              console.error("Error fetching coins:", error);
              const errorMsg = error.message || "Failed to fetch cryptocurrency data"
              dispatch({
                type: actionTypes.COIN_API_ERROR,
                payload : errorMsg
              })
          })
      }
  }

// exchange rate action
export const fetchCoinList = () => {
  return (dispatch) => {
    const url = API_CONFIG.addApiKey(`${API_CONFIG.BASE_URL}/exchange_rates`);
    axios.get(url)
    .then(response =>{
      const data = response.data
      dispatch({
        type: actionTypes.EXCHANGE_SUCCESS,
        payload: data
      })
    })
      .catch(error => {
        console.error("Error fetching exchange rates:", error);
        const errorMsg = error.message || "Failed to fetch exchange rates"
        dispatch({
          type: actionTypes.EXCHANGE_ERROR,
          payload: errorMsg  
      })
    })
  }
}

