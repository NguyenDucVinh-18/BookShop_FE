import axios from "./axios.customize";

const createReviewAPI = (formData) => {
  return axios.post("/api/product-review/create", formData, {
    headers: {
        "Content-Type": "multipart/form-data"
    },
  })
  .catch((err) => {
    console.error("API Error:", err);
    throw err;
    });
};

const getReviewsByProductIdAPI = (productId) => {
  const URL_BACKEND = `/api/product-review/getReviewProduct/${productId}`;
  return axios.get(URL_BACKEND);
}

export { createReviewAPI, getReviewsByProductIdAPI };