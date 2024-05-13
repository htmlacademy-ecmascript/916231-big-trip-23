import {getRandomArrayElement, getRandomInteger} from '../utils.js';
import {DESTINATIONS, DESCRIPTIONS} from '../const.js';

const MIN_PICTURES_COUNT = 0;
const MAX_PICTURES_COUNT = 5;
const MIN_PICTURE_ID = 0;
const MAX_PICTURE_ID = 1000;

const mockDestinations = [
  {
    id: 'cfe416cq-10xa-ye10-8077-2fs9a01edcab',
    name: getRandomArrayElement(DESTINATIONS),
    description: getRandomArrayElement(DESCRIPTIONS),
    pictures: Array.from({
      length: getRandomInteger(MIN_PICTURES_COUNT, MAX_PICTURES_COUNT)
    }, () => ({
      src: `https://loremflickr.com/248/152?random=${getRandomInteger(MIN_PICTURE_ID, MAX_PICTURE_ID)}`,
      description: getRandomArrayElement(DESCRIPTIONS)
    })),
  },
  {
    id: 'bfa5cb75-a1fe-4b77-a83c-0e528e910e04',
    name: getRandomArrayElement(DESTINATIONS),
    description: getRandomArrayElement(DESCRIPTIONS),
    pictures: Array.from({
      length: getRandomInteger(MIN_PICTURES_COUNT, MAX_PICTURES_COUNT)
    }, () => ({
      src: `https://loremflickr.com/248/152?random=${getRandomInteger(MIN_PICTURE_ID, MAX_PICTURE_ID)}`,
      description: getRandomArrayElement(DESCRIPTIONS)
    })),
  },
];

const getDestination = () => mockDestinations;

export {getDestination};
