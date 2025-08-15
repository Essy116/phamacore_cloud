
import axios from 'axios';

const BASE_URL = 'http://20.164.20.36:86/api';

const HEADERS = {
  Accept: 'text/plain',
  'Content-Type': 'application/json',
};

export const resetPasswordRequest = (identifier) =>
  axios.post(
    `${BASE_URL}/v1/auth/reset-password-request`,
    { identifier },
    {
      headers: {
        ...HEADERS,
        
      },
    }
  );
