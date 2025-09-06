import axios from "./axios.customize";

const loginAPI = (email, password) => {
  const URL_BACKEND = "/api/auth/login";
  const data = {
    email,
    password,
  };
  return axios.post(URL_BACKEND, data);
};

const getAccountAPI = () => {
  const URL_BACKEND = "/api/auth/account";
  return axios.get(URL_BACKEND);
};

const registerAPI = (username, email, phone, password) => {
  const URL_BACKEND = "/api/auth/signUp";
  const data = {
    username,
    email,
    phone,
    password,
  };
  return axios.post(URL_BACKEND, data);
};

const resendVerificationEmail = (email) => {
  const URL_BACKEND = "/api/auth/resendVerificationEmail";
  const data = { email };
  return axios.post(URL_BACKEND, data);
};

const createAccountAPI = (username, email, password, phone, role) => {
  const URL_BACKEND = "/api/auth/createAccount";
  const data = {
    username,
    email,
    password,
    phone,
    role,
  };
  return axios.post(URL_BACKEND, data);
};

const getAllUsersAPI = () => {
  const URL_BACKEND = "/api/auth/getAllUsers";
  return axios.get(URL_BACKEND);
};

export {
  loginAPI,
  getAccountAPI,
  registerAPI,
  resendVerificationEmail,
  createAccountAPI,
  getAllUsersAPI,
};
