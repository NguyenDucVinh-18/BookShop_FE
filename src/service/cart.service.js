import axios from "./axios.customize";

const getCartAPI = () => {
  const URL_BACKEND = "/api/cart/getCart";
  return axios.get(URL_BACKEND);
};

const addProductToCartAPI = async (productId, quantity) => {
  const URL_BACKEND = "/api/cart/addProductToCart";
  return axios.post(URL_BACKEND, { productId: productId, quantity: quantity });
};

const removeProductFromCartAPI = async (productId) => {
  const URL_BACKEND = `/api/cart/removeProductFromCart?productId=${productId}`;
  return axios.delete(URL_BACKEND);
}

export { getCartAPI, addProductToCartAPI, removeProductFromCartAPI };
