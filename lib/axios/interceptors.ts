import axios from "axios";

const elevenLabsUrl = process.env.NEXT_PUBLIC_ELEVEN_LABS_API_URL;
const elevenLabsAPIKey = process.env.NEXT_PUBLIC_ELEVEN_LABS_API_KEY;

const axiosInterceptorsInstance = axios.create({
  baseURL: elevenLabsUrl,
});

// request
axiosInterceptorsInstance.interceptors.request.use(
  (config) => {
    config.headers["Content-Type"] =
      config.headers["Content-Type"] || "application/json";
    config.headers["xi-api-key"] = elevenLabsAPIKey;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInterceptorsInstance;
