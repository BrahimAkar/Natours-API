import axios from 'axios';

export const logout = async () => {
  console.log('im here');
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout'
    });
    console.log('res', res);
    if (res.data.status === 'success') {
      window.location.reload(true);
      window.location.assign('/');
    }
  } catch (error) {
    console.log(error);
  }
};
