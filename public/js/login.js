// /* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  console.log('Email', email);
  console.log('Password', password);
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/users/login',
      data: {
        email,
        password
      }
    });
    console.log(res);
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');

      window.setTimeout(() => {
        window.location.assign('/');
      }, 1500);
    }
  } catch (error) {
    console.log(error.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};
