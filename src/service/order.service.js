import axios from "./axios.customize";

const getAllOrderAPI = () => {
    const URL_BACKEND = `/api/order/getOrders`;
    return axios.get(URL_BACKEND);
}

const cancelOrderAPI = (orderId, reason) => {
    const URL_BACKEND = `/api/order/cancelOrder/${orderId}`;
    const data = { reason };
    return axios.put(URL_BACKEND, data);
}

export {
    getAllOrderAPI,
    cancelOrderAPI
};