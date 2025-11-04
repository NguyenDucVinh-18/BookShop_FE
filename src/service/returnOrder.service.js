import axios from "./axios.customize";

const getAllReturnOrdersAPI = () => {
  const URL_BACKEND = `/api/return-order/getAll`;
  return axios.get(URL_BACKEND);
};

const createReturnOrderAPI = (formData) => {
  return axios
    .post("/api/return-order/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .catch((err) => {
      console.error("API Error:", err);
      throw err;
    });
};

const updateReturnOrderStatusAPI = (returnOrderId, status) => {
  const URL_BACKEND = `/api/return-order/update-status/${returnOrderId}?status=${status}`;
  return axios.put(URL_BACKEND);
};

export {
  getAllReturnOrdersAPI,
  createReturnOrderAPI,
  updateReturnOrderStatusAPI,
};
