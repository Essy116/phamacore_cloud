
import axios from 'axios';

const BASE_URL = 'http://20.164.20.36:86/api';
const HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  accessKey:
    'R0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9',
};

export const getUserByEmail = (email) =>
  axios.get(`${BASE_URL}/auth/GetUserByEmail/${encodeURIComponent(email)}`, {
    headers: HEADERS,
  });
