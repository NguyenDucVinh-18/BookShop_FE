import axios from "./axios.customize";

const changePasswordAPI = (currentPassword, newPassword) => {
  const URL_BACKEND = `/api/user/changePassword`;
  const data = { currentPassword, newPassword };
  return axios.post(URL_BACKEND, data);
}

const addAddress = ( street , ward , district , city, note) => {
  const URL_BACKEND = `/api/user/addAddress`;
  const data = { street , ward , district , city, note };
  return axios.post(URL_BACKEND, data);
}

const getAddresses = () => {
  const URL_BACKEND = `/api/user/addresses`;
  return axios.get(URL_BACKEND);
}

const deleteAddress = (addressId) => {
    const URL_BACKEND = `/api/user/deleteAddress/${addressId}`;
    return axios.delete(URL_BACKEND);
}

const updateAddress = ( addressId, street , ward , district , city, note) => {
    const URL_BACKEND = `/api/user/updateAddress/${addressId}`;
    const data = { street , ward , district , city, note };
    return axios.put(URL_BACKEND, data);
  }

export {changePasswordAPI, addAddress , getAddresses, deleteAddress, updateAddress};