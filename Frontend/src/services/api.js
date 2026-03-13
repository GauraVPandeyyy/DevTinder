import axios from "axios"
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errData = error?.response?.data;
      
      // Agar express-validator ne error array bheja hai
      if (errData?.errors && errData.errors.length > 0) {
        var message =errData.errors[0].msg;
      } else {
        // Normal error message ke liye
        var message =errData?.message || "something went wrong ";
      }

    toast.error(message);

    return Promise.reject(error);
  }
);

export default api