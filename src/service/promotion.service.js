import axios from "./axios.customize";

const createPromotionAPI = (formData) => {
  const URL_BACKEND = `/api/promotion/createPromotion`;
  return axios.post(URL_BACKEND, formData);
};

const getAllPromotionsAPI = () => {
  const URL_BACKEND = `/api/promotion/getAllPromotions`;
  return axios.get(URL_BACKEND);
};

const updatePromotionAPI = (id, formData) => {
  const URL_BACKEND = `/api/promotion/updatePromotion/${id}`;
  return axios.put(URL_BACKEND, formData);
};

const deletePromotionAPI = (id) => {
  const URL_BACKEND = `/api/promotion/deletePromotion/${id}`;
  return axios.delete(URL_BACKEND);
};

const getPromotionByCodeAPI = (code) => {
  const URL_BACKEND = `/api/promotion/getPromotionByCode/${code}`;
  return axios.get(URL_BACKEND);
};

const getPromotionForCustomerAPI = () => {
  const URL_BACKEND = `/api/promotion/getPromotionsForCustomers`;
  return axios.get(URL_BACKEND);
};

const getPromotionsActiveAPI = () => {
  const URL_BACKEND = `/api/promotion/getPromotionsActive`;
  return axios.get(URL_BACKEND);
};

export {
  createPromotionAPI,
  getAllPromotionsAPI,
  updatePromotionAPI,
  deletePromotionAPI,
  getPromotionByCodeAPI,
  getPromotionForCustomerAPI,
  getPromotionsActiveAPI,
};
