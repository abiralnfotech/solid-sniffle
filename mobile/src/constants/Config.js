import Constants from 'expo-constants';

const getBaseUrl = () => {
  // If running in development, use the host IP for the backend
  // In production, this would be your production API URL
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(':')[0] || 'localhost';

  return `http://${localhost}:8000`;
};

export default {
  API_URL: getBaseUrl(),
  API_V1_STR: '/api/v1',
};
