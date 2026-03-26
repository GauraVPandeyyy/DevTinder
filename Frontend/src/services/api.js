import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: location.hostname === "localhost" ? "http://localhost:5000" : "/api",
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errData = error?.response?.data;
    let message = "Something went wrong"; // FIX: Default message using let
      
    // Handle express-validator errors vs standard errors
    if (errData?.errors && errData.errors.length > 0) {
      message = errData.errors[0].msg;
    } else if (errData?.message) {
      message = errData.message;
    }

    // Optional: Handle 401 Unauthorized globally later when we setup routing
    if (error.response?.status === 401) {
       window.location.href = '/login';
    }

    // toast.error(message);
    return Promise.reject(error);
  }
);

export default api;