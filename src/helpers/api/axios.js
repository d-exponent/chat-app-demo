import axios from "axios";

// const baseURL = "http://localhost:5000";
const baseURL = "https://api.taronapp.com/message-service";

const axiosForMessageSvc = axios.create({
  baseURL,
});

export default axiosForMessageSvc;
