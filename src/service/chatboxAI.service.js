import axios from "./axios.customize";

const sendChatboxMessageAPI = async (data) => {
    const URL_BACKEND = "/api/chat/chatboxAI";
    return axios.post(URL_BACKEND, data);
  };

export { sendChatboxMessageAPI };