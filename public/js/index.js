import { login } from './login';
import { displayMap } from './mapbox';
import '@babel/polyfill';
import { logout } from './logout';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { showAlert } from './alerts';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

// VALUES

if (userDataForm) {
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });
}
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating ...';
    const currentpassword = document.querySelector('#password-current').value;
    const newpassword = document.querySelector('#password').value;
    const confirmNewPassword = document.querySelector('#password-confirm')
      .value;
    if (newpassword !== confirmNewPassword) {
      const markup = `<div style="color:red;font-size:14px"> Passwords Must be matched </div>`;

      return document
        .querySelector('#password-confirm')
        .insertAdjacentHTML('afterend', markup);
    }
    await updateSettings({ currentpassword, newpassword }, 'password');
    document.querySelector('.btn--save-password').textContent = 'Save password';

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}
// DELEGATION
if (loginForm) {
  document.querySelector('.form--login').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    login(email, password);
  });
}

let locations;
if (mapBox) {
  locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (bookBtn) {
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) {
  showAlert('success', alertMessage);
}
