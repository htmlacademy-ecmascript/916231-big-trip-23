import {getRandomArrayElement, getRandomInteger} from '../utils.js';

const mockEvents = [
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808c',
    basePrice: getRandomInteger(0, 1000),
    dateFrom: '2019-08-10T12:55:56.845Z',
    dateTo: '2019-08-11T11:15:13.375Z',
    destination: 'cfe416cq-10xa-ye10-8077-2fs9a01edcab',
    isFavorite: true,
    offers: [
      'b4c3e4e6-9053-42ce-b747-e281314baa31',
      'b4c3e4e6-9053-42ce-b747-e281314baa32',
    ],
    type: 'taxi',
  },
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808c',
    basePrice: getRandomInteger(0, 1000),
    dateFrom: '2019-12-10T12:55:56.845Z',
    dateTo: '2019-12-10T13:22:13.375Z',
    destination: 'bfa5cb75-a1fe-4b77-a83c-0e528e910e04',
    isFavorite: true,
    offers: [
      'b4c3e4e6-9053-42ce-b747-e281314baa11'
    ],
    type: 'drive',
  },
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808c',
    basePrice: getRandomInteger(0, 1000),
    dateFrom: '2019-07-10T01:55:56.845Z',
    dateTo: '2019-07-11T02:22:13.375Z',
    destination: 'bfa5cb75-a1fe-4b77-a83c-0e528e910e04',
    isFavorite: false,
    offers: [
      'b4c3e4e6-9053-42ce-b747-e281314baa51',
      'b4c3e4e6-9053-42ce-b747-e281314baa61'
    ],
    type: 'flight',
  },
];

const getRandomEvent = () => getRandomArrayElement(mockEvents);

export {getRandomEvent};
