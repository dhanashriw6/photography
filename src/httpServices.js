import axios from 'axios';
import CryptoJS from 'crypto-js';
import { authendpoint } from './api';

const API_KEY = import.meta.env.VITE_API_KEY;
const SECRET  = import.meta.env.VITE_HMAC_SECRET;

// ─── Token Refresh Queue logic ──────────────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ─── Request Interceptor ────────────────────────────────────────────────────
axios.interceptors.request.use((request) => {
  // 1. Auth token
  const token = localStorage.getItem('authToken');
  if (token) request.headers['Authorization'] = `Bearer ${token}`;

  // 2. Device ID
  const deviceId = localStorage.getItem('deviceId');
  if (deviceId) request.headers['x-device-id'] = deviceId;

  // 3. HMAC-SHA256 signature — required by the server middleware
  const timestamp = Date.now().toString();
  const body      = request.data ? JSON.stringify(request.data) : '{}';
  const signature = CryptoJS.HmacSHA256(body + timestamp, SECRET).toString(
    CryptoJS.enc.Hex
  );

  request.headers['x-api-key']   = API_KEY;
  request.headers['x-timestamp'] = timestamp;
  request.headers['x-signature'] = signature;

  return request;
});

// ─── Response Interceptor ───────────────────────────────────────────────────
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized) and not already retrying
    // Bypass automatic redirect for public endpoints (e.g. pre-launch leads)
    const isPublicEndpoint = originalRequest?.url?.includes('/pre-launch-leads');

    if (error.response?.status === 401 && !originalRequest._retry && !isPublicEndpoint) {
      
      // If already refreshing, queue the request
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axios(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        // No refresh token available, logout and redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/join-as-photographer/login';
        return Promise.reject(error);
      }

      try {
        // Create a separate axios instance for refresh to bypass the interceptors loop
        const refreshInstance = axios.create();
        
        // Need to add HMAC headers for the refresh call as well
        const timestamp = Date.now().toString();
        const payloadStr = JSON.stringify({ refresh_token: refreshToken });
        const signature = CryptoJS.HmacSHA256(payloadStr + timestamp, SECRET).toString(CryptoJS.enc.Hex);
        
        const headers = {
          'x-api-key': API_KEY,
          'x-timestamp': timestamp,
          'x-signature': signature,
          'x-device-id': localStorage.getItem('deviceId') || ''
        };

        const { data } = await refreshInstance.post(authendpoint.refreshToken, {
          refresh_token: refreshToken
        }, { headers });

        const newAccessToken = data?.data?.access_token;
        const newRefreshToken = data?.data?.refresh_token;

        if (newAccessToken) {
          // Update tokens in local storage
          localStorage.setItem('authToken', newAccessToken);
          if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
          
          // Apply new token to the original request
          originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
          
          // Process queued requests
          processQueue(null, newAccessToken);
          
          // Retry the original request
          return axios(originalRequest);
        } else {
           throw new Error("Token refresh response invalid");
        }
      } catch (err) {
        // Refresh token expired or invalid, force logout
        processQueue(err, null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/join-as-photographer/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default {
  get:    axios.get,
  post:   axios.post,
  delete: axios.delete,
  patch:  axios.patch,
  put:    axios.put,
};