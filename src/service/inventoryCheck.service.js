import axios from "./axios.customize";

const createInventoryCheckAPI = (nameInventoryCheckReceipt, products, note) => {
  const URL_BACKEND = `/api/inventory-check-receipt/create`;
  const data = {
    nameInventoryCheckReceipt,
    products,
    note,
  };
  return axios.post(URL_BACKEND, data);
};

const getAllInventoryCheckAPI = () => {
  const URL_BACKEND = `/api/inventory-check-receipt/getAll`;
  return axios.get(URL_BACKEND);
};

const getInventoryChecksBetweenDatesAPI = (startDate, endDate) => {
  const URL_BACKEND = `/api/inventory-check-receipt/getDateBetween?startDate=${startDate}&endDate=${endDate}`;
  return axios.get(URL_BACKEND);
};

export {
  createInventoryCheckAPI,
  getAllInventoryCheckAPI,
  getInventoryChecksBetweenDatesAPI,
};
