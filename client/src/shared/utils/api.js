import axios from 'axios';

import history from 'browserHistory';
import toast from 'shared/utils/toast';
import { objectToQueryString } from 'shared/utils/url';
import { getStoredAuthToken, removeStoredAuthToken } from 'shared/utils/authToken';
import process from 'process';

const defaults = {
  baseURL: process.env.API_URL || 'http://localhost:3000',
  headers: () => ({
    'Content-Type': 'application/json',
    Authorization: getStoredAuthToken() ? `Bearer ${getStoredAuthToken()}` : undefined,
  }),
  error: {
    code: 'INTERNAL_ERROR',
    message:
      'Something went wrghfghong. Please check your internet connection or contact our support.',
    status: 503,
    data: {},
  },
};

const api = (method, url, variables) =>
  new Promise((resolve, reject) => {
    axios({
      url: `${defaults.baseURL}${url}`,
      method,
      headers: defaults.headers(),
      params: method === 'get' ? variables : undefined,
      data: method !== 'get' ? variables : undefined,
      paramsSerializer: objectToQueryString,
    }).then(
      response => {
        console.log('gor final ans');
        resolve(response.data);
      },
      error => {
        console.log('gor final error');
        console.log(JSON.stringify(error));
        if (error.response) {
          if (error.response.data.error.code === 'INVALID_TOKEN') {
            removeStoredAuthToken();
            console.log('error1');
            history.push('/authenticate');
          } else {
            console.log('error2');
            reject(error.response.data.error);
          }
        } else {
          console.log('error3');
          reject(defaults.error);
        }
      },
    );
  });

const optimisticUpdate = async (url, { updatedFields, currentFields, setLocalData }) => {
  try {
    setLocalData(updatedFields);
    await api('put', url, updatedFields);
  } catch (error) {
    setLocalData(currentFields);
    toast.error(error);
  }
};

export default {
  get: (...args) => api('get', ...args),
  post: (...args) => api('post', ...args),
  put: (...args) => api('put', ...args),
  patch: (...args) => api('patch', ...args),
  delete: (...args) => api('delete', ...args),
  optimisticUpdate,
};
