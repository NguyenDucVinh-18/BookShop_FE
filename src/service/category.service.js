import axios from "./axios.customize";

const getAllCategoriesAPI = () => {
  const URL_BACKEND = `/api/category/getAllCategories`;
  return axios.get(URL_BACKEND);
}

const createCategoryAPI = (data) => {
  const URL_BACKEND = `/api/category/createCategory`;
  return axios.post(URL_BACKEND, data);
}

const getParentCategoriesAPI = () => {
  const URL_BACKEND = `/api/category/getAllRootCategories`;
  return axios.get(URL_BACKEND);
}


const updateCategoryAPI = (id, data) => {
  const URL_BACKEND = `/api/category/updateCategory/${id}`;
  return axios.put(URL_BACKEND, data);
}

const deleteCategoryAPI = (id) => {
  const URL_BACKEND = `/api/category/deleteCategory/${id}`;
  return axios.delete(URL_BACKEND);
}

export { getAllCategoriesAPI, createCategoryAPI, getParentCategoriesAPI, updateCategoryAPI, deleteCategoryAPI };