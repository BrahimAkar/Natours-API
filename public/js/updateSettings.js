import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
  console.log('type', type);
  console.log('data', data);
  const url =
    type === 'password'
      ? '/api/v1/users/updatepassword'
      : '/api/v1/users/updateme';
  try {
    const response = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (response.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);

      // window.setTimeout(() => {
      //   window.location.reload(true);
      // }, 1500);
    }
  } catch (error) {
    console.log(error);
    showAlert('error', error.response.data.message);
  }
};
