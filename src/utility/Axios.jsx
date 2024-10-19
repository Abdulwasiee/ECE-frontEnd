import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://backendedu-w5ld.onrender.com",
});

export { axiosInstance };
