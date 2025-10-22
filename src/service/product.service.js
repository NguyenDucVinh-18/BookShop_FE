import axios from "./axios.customize";

const getProductByIdAPI = (productId) => {
  const URL_BACKEND = `/api/product/getProductById/${productId}`;
  return axios.get(URL_BACKEND);
};

const createProductAPI = async (formData) => {
  return axios
    .post("/api/product/createProduct", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .catch((err) => {
      console.error("API Error:", err);
      throw err;
    });
};

const getAllProductsAPI = () => {
  const URL_BACKEND = "/api/product/getAllProducts";
  return axios.get(URL_BACKEND);
};

const getProductByParentCategoryAPI = (parentCategoryId) => {
  const URL_BACKEND = `/api/product/getByParentCategoryId/${parentCategoryId}`;
  return axios.get(URL_BACKEND);
};

const getProductByCategoryNameAPI = (parentCategoryName, categoryName) => {
  const URL_BACKEND = `/api/product/${parentCategoryName}/${categoryName}`;
  return axios.get(URL_BACKEND);
};

const updateDiscountPercentageAPI = (productId, discountPercentage) => {
  const URL_BACKEND = `/api/product/updateDiscountPercentage/${productId}?discountPercentage=${discountPercentage}`;
  return axios.post(URL_BACKEND);
};

const getProductsByNameAPI = (productName) => {
  const URL_BACKEND = `/api/product/getByProductName/${productName}`;
  return axios.get(URL_BACKEND);
}

export {
  getProductByIdAPI,
  createProductAPI,
  getAllProductsAPI,
  getProductByParentCategoryAPI,
  getProductByCategoryNameAPI,
  updateDiscountPercentageAPI,
  getProductsByNameAPI,
};
