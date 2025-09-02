import axios from "./axios.customize";

const getProductByIdAPI = (productId) => {
  const URL_BACKEND = `/api/product/getProductById/${productId}`;
  return axios.get(URL_BACKEND);
}

export {
  getProductByIdAPI
};