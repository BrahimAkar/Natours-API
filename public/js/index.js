import { login } from './login';
import { displayMap } from './mapbox';
import '@babel/polyfill';

const form = document.querySelector('.form');
if (form) {
  document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    login(email, password);
  });
}

let locations;
if (document.getElementById('map')) {
  locations = JSON.parse(document.getElementById('map').dataset.locations);
  displayMap(locations);
}
