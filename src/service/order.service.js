import axios from "./axios.customize";

const getOrderAPI = () => {
  const URL_BACKEND = `/api/order/getOrders`;
  return axios.get(URL_BACKEND);
};

const cancelOrderAPI = (orderId, reason) => {
  const URL_BACKEND = `/api/order/cancelOrder/${orderId}`;
  const data = { reason };
  return axios.put(URL_BACKEND, data);
};

const getAllOrdersAPI = () => {
  const URL_BACKEND = `/api/order/getAllOrders`;
  return axios.get(URL_BACKEND);
};

const placeOrderAPI = (products, paymentMethod, address, phone, note, promotionCode) => {
  const URL_BACKEND = `/api/order/placeOrder`;
  const data = {
    products,
    paymentMethod,
    address,
    phone,
    note,
    promotionCode,
  };
  return axios.post(URL_BACKEND, data);
};

const getOrderByIdAPI = (orderId) => {
  const URL_BACKEND = `/api/order/${orderId}`;
  return axios.get(URL_BACKEND);
};

const repaymentOrderAPI = (orderId) => {
  const URL_BACKEND = `/api/order/repayment/${orderId}`;
  return axios.post(URL_BACKEND);
};

const updateOrderStatusAPI = (orderId, status) => {
  const URL_BACKEND = `/api/order/updateOrderStatus/${orderId}?status=${status}`;
  return axios.put(URL_BACKEND);
};

export {
  getOrderAPI,
  cancelOrderAPI,
  getAllOrdersAPI,
  placeOrderAPI,
  getOrderByIdAPI,
  repaymentOrderAPI,
  updateOrderStatusAPI,
};
