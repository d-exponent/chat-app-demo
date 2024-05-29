import axios from "axios";

const axiosForMessageSvc = axios.create({
  baseURL: "http://localhost:5000", // message service base url
});

export default axiosForMessageSvc;
