import axios from "./axios.customize";

const getTotalStatisticsAPI  = (startDate, endDate) => {
  const URL_BACKEND = `/api/statistic/total?startDate=${startDate}&endDate=${endDate}`;
  return axios.get(URL_BACKEND);
}

const getProductsSoldAPI = (startDate, endDate) => {
    const URL_BACKEND = `/api/statistic/products-sold?startDate=${startDate}&endDate=${endDate}`;
    return axios.get(URL_BACKEND);
}

export {
    getTotalStatisticsAPI,
    getProductsSoldAPI
};