import axios from "./axios.customize";

const getAllNotificationsAPI = () => {
  const URL_BACKEND = `/api/notification/getAll`;
  return axios.get(URL_BACKEND);
};

const getCountUnreadNotificationsAPI = () => {
  const URL_BACKEND = `/api/notification/countUnread`;
  return axios.get(URL_BACKEND);
};

const readAllNotificationAPI = () => {
  const URL_BACKEND = `/api/notification/readAll`;
  return axios.post(URL_BACKEND);
};

const createNotificationAPI = (title, message) => {
  const URL_BACKEND = `/api/notification/createNotification`;
  const data = { title, message };
  return axios.post(URL_BACKEND, data);
};

const updateNotificationAPI = (id, title, message) => {
  const URL_BACKEND = `/api/notification/updateNotification/${id}`;
  const data = { title, message };
  return axios.put(URL_BACKEND, data);
};

const deleteNotificationAPI = (id) => {
  const URL_BACKEND = `/api/notification/deleteNotification/${id}`;
  return axios.delete(URL_BACKEND);
};

export {
  getAllNotificationsAPI,
  getCountUnreadNotificationsAPI,
  readAllNotificationAPI,
  createNotificationAPI,
  updateNotificationAPI,
  deleteNotificationAPI,
};
