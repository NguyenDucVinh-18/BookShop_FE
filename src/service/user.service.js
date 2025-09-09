import axios from "./axios.customize";

const changePasswordAPI = (currentPassword, newPassword) => {
  const URL_BACKEND = `/api/user/changePassword`;
  const data = { currentPassword, newPassword };
  return axios.post(URL_BACKEND, data);
};

const addAddress = (street, ward, district, city, note) => {
  const URL_BACKEND = `/api/user/addAddress`;
  const data = { street, ward, district, city, note };
  return axios.post(URL_BACKEND, data);
};

const getAddresses = () => {
  const URL_BACKEND = `/api/user/addresses`;
  return axios.get(URL_BACKEND);
};

const deleteAddress = (addressId) => {
  const URL_BACKEND = `/api/user/deleteAddress/${addressId}`;
  return axios.delete(URL_BACKEND);
};

const updateAddress = (addressId, street, ward, district, city, note) => {
  const URL_BACKEND = `/api/user/updateAddress/${addressId}`;
  const data = { street, ward, district, city, note };
  return axios.put(URL_BACKEND, data);
};

const getAddressById = (addressId) => {
  const URL_BACKEND = `/api/user/getAddress/${addressId}`;
  return axios.get(URL_BACKEND);
}

const updateInFo = (username, phone) => {
  const URL_BACKEND = `/api/user/updateInfo`;
  const data = { username, phone };
  return axios.put(URL_BACKEND, data);
};

const updateAvatarAPI = (imageFile) => {
  const formData = new FormData();
    formData.append("image", imageFile);
  const URL_BACKEND = `/api/user/updateAvatar`;
  return axios.post(URL_BACKEND, formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

const updateInFoAccountAPI = (id, username, phone, email, role) => {
  const URL_BACKEND = `/api/user/updateInfoAccount/${id}`;
  const data = { username, phone, email, role };
  return axios.put(URL_BACKEND, data);
};

const getAllCustomersAPI = () => {
  const URL_BACKEND = "/api/user/getAllCustomers";
  return axios.get(URL_BACKEND);
};

const getAllEmployeesAPI = () => {
  const URL_BACKEND = "/api/user/employees";
  return axios.get(URL_BACKEND);
}

const updateActiveAccountAPI = (id, isActive) => {
  const URL_BACKEND = `/api/user/updateActiveAccount/${id}`;
  const data = { isActive };
  return axios.put(URL_BACKEND, data);
}


export {
  changePasswordAPI,
  addAddress,
  getAddresses,
  deleteAddress,
  updateAddress,
  getAddressById,
  updateInFo,
  updateAvatarAPI,
  updateInFoAccountAPI,
  getAllCustomersAPI,
  getAllEmployeesAPI,
  updateActiveAccountAPI
};
