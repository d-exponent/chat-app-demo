import axios from "axios";

const axiosForMessageSvc = axios.create({
  baseURL: "https://smmhs7uata.execute-api.us-east-1.amazonaws.com/dev", // message service base url
});

export default axiosForMessageSvc;
