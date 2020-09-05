import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51HLZhmD4DwwpYAsi7GLwp3uLAMLGCGQxOhFquQCfXADbG3URuZ5vbJl6jwNBI5vikU8FoGOMF8nIie49vYpXY1up00a3oKO9VE'
);

export const bookTour = async tourId => {
  try {
    // 1) Get the session from the server API
    const session = await axios({
      method: 'GET',
      url: `/api/v1/bookings/checkout-session/${tourId}`
    });
    // 2) Create the checkout form + charge the credit card

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (error) {
    showAlert('error', error);
  }
};
