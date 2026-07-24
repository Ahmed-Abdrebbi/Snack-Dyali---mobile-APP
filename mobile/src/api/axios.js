import axios from 'axios';
import { Platform } from 'react-native';

// Use local machine IP instead of localhost for Android emulator or physical devices
const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    // 10.0.2.2 is the special IP for Android emulator to connect to host localhost
    return 'http://10.0.2.2:3000/api';
  }
  // For iOS simulator or web
  return 'http://localhost:3000/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
