import axios from 'axios';

const loginApi = async ({ email, password }) => {
  try {
    const response = await axios.post(
      'http://20.164.20.36:86/api/v1/auth/authenticate-user',
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          accesskey:
            'R0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9',
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    const responseData = error.response?.data;

    return {
      success: false,
      message:
        responseData?.message || 'Login failed. Please check your credentials.',
      errors: responseData?.errors || {},
      status: error.response?.status,
    };
  }
};

export default loginApi;
