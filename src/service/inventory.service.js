import axios from "./axios.customize";

const createReceiptAPI = (nameStockReceipt,products, note, typeStockReceipt) => {
  const URL_BACKEND = `/api/stock-receipt/createReceipt`;
  const data = {
    nameStockReceipt,
    products,
    note,
    typeStockReceipt,
  };
  return axios.post(URL_BACKEND, data);
}

const getAllReceiptsAPI = () => {
  const URL_BACKEND = `/api/stock-receipt/getAll`;
  return axios.get(URL_BACKEND);
}

const getReceiptsBetweenDatesAPI = (startDate, endDate) => {
  const URL_BACKEND = `/api/stock-receipt/getDateBetween?startDate=${startDate}&endDate=${endDate}`;
  return axios.get(URL_BACKEND);
}

export {
  createReceiptAPI,
  getAllReceiptsAPI,
  getReceiptsBetweenDatesAPI,
};