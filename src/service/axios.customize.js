import axios from "axios";

// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json", // Gửi dữ liệu dưới dạng JSON
    "Accept": "application/json", // Chấp nhận phản hồi dưới dạng JSON
  },
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  // Kiểm tra nếu có access_token trong localStorage
  if (typeof window !== "undefined" && window && window.localStorage && window.localStorage.getItem('access_token')) {
    config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('access_token');
  }
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
  // Kiểm tra nếu response.data có data và trả về
  if (response.data.data) return response.data;
  return response;
}, function (error) {
  // Nếu có lỗi, kiểm tra error.response và trả về lỗi
  if (error.response && error.response.data) return error.response.data;
  return Promise.reject(error);
});

// Export instance để dùng trong các API gọi khác
export default instance;
