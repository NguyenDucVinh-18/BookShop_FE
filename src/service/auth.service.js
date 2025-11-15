import axios from "./axios.customize";

const loginCustomerAPI = (email, password) => {
  const URL_BACKEND = "/api/auth/loginCustomer";
  const data = {
    email,
    password,
  };
  return axios.post(URL_BACKEND, data);
};

const loginEmployeeAPI = (email, password) => {
  const URL_BACKEND = "/api/auth/loginEmployee";
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

const createAccountEmployeeAPI = (username, email, password, phone, role) => {
  const URL_BACKEND = "/api/auth/createAccountEmployee";
  const data = {
    username,
    email,
    password,
    phone,
    role,
  };
  return axios.post(URL_BACKEND, data);
};

const createAccountCustomerAPI = (username, email, password, phone) => {
  const URL_BACKEND = "/api/auth/createAccountCustomer";
  const data = {
    username,
    email,
    password,
    phone,
  };
  return axios.post(URL_BACKEND, data);
};

const findByEmailAPI = (email) => {
  const URL_BACKEND = `/api/auth/findByEmail?email=${email}`;
  return axios.get(URL_BACKEND);
};

const sendResetPasswordOtpAPI = (email) => {
  const URL_BACKEND = `/api/auth/sendResetPasswordOtp`;
  const data = { email };
  return axios.post(URL_BACKEND, data);
};

const resetPasswordAPI = (email, newPassword, otp) => {
  const URL_BACKEND = `/api/auth/resetPassword`;
  const data = { email, newPassword, otp };
  return axios.post(URL_BACKEND, data);
};

const removeResetPasswordOtpAPI = (email) => {
  const URL_BACKEND = `/api/auth/removeResetPasswordOtp`;
  const data = { email };
  return axios.post(URL_BACKEND, data);
};

const loginCustomerOauth2API = (token) => {
  const URL_BACKEND = `/api/auth/login-oauth2?token=${token}`;
  return axios.post(URL_BACKEND);
};

export {
  loginCustomerAPI,
  loginEmployeeAPI,
  getAccountAPI,
  registerAPI,
  resendVerificationEmail,
  createAccountEmployeeAPI,
  createAccountCustomerAPI,
  findByEmailAPI,
  sendResetPasswordOtpAPI,
  resetPasswordAPI,
  removeResetPasswordOtpAPI,
  loginCustomerOauth2API,
};
