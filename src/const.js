import {getDefaultDateFrom, getDefaultDateTo} from './utils.js';

const DESTINATIONS = ['Amsterdam', 'Chamonix', 'Geneva', 'Test1', 'Test2'];

const DESCRIPTIONS = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetr',
  'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.'];

const EVENT_TYPES = ['taxi', 'bus', 'train','ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const DEFAULT_EVENT = {
  basePrice: 0,
  dateFrom: getDefaultDateFrom(),
  dateTo: getDefaultDateTo(),
  destination: '',
  offers: [],
  type: EVENT_TYPES[0],
};

const SortTypes = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer',
};

const FilterTypes = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export {DESTINATIONS, DESCRIPTIONS, EVENT_TYPES, DEFAULT_EVENT, SortTypes, FilterTypes, UserAction, UpdateType};
