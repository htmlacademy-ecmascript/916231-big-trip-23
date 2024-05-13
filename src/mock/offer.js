import {getRandomInteger} from '../utils.js';

const MIN_PRICE = 0;
const MAX_PRICE = 1000;

const mockOffers = [
  {
    type: 'taxi',
    offers: [{
      id: 'b4c3e4e6-9053-42ce-b747-e281314baa31',
      title: 'Order Uber',
      price: getRandomInteger(MIN_PRICE, MAX_PRICE),
    },
    {
      id: 'b4c3e4e6-9053-42ce-b747-e281314baa32',
      title: 'Order Uber 2',
      price: getRandomInteger(MIN_PRICE, MAX_PRICE),
    }]
  },
  {
    type: 'drive',
    offers: [{
      id: 'b4c3e4e6-9053-42ce-b747-e281314baa11',
      title: 'Rent a car',
      price: getRandomInteger(MIN_PRICE, MAX_PRICE),
    }]
  },
  {
    type: 'check-in',
    offers: [{
      id: 'b4c3e4e6-9053-42ce-b747-e281314baa21',
      title: 'Add breakfast',
      price: getRandomInteger(MIN_PRICE, MAX_PRICE),
    }]
  },
  {
    type: 'flight',
    offers: [{
      id: 'b4c3e4e6-9053-42ce-b747-e281314baa51',
      title: 'Add breakfast',
      price: getRandomInteger(MIN_PRICE, MAX_PRICE),
    },
    {
      id: 'b4c3e4e6-9053-42ce-b747-e281314baa61',
      title: 'Add breakfast 2',
      price: getRandomInteger(MIN_PRICE, MAX_PRICE),
    }]
  },
  {
    type: 'sightseeing',
    offers: [{
      id: 'b4c3e4e6-9053-42ce-b747-e281314baa81',
      title: 'Add breakfast',
      price: getRandomInteger(MIN_PRICE, MAX_PRICE),
    }]
  },
  {
    type: 'bus',
    offers: [{
      id: 'b4c3e4e6-9053-42ce-b747-e281314baa71',
      title: 'Add breakfast',
      price: getRandomInteger(MIN_PRICE, MAX_PRICE),
    }]
  },
];

const getOffer = () => mockOffers;

export {getOffer};
