const EVENT_TYPES = ['taxi', 'bus', 'train','ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const DEFAULT_EVENT = {
  basePrice: 0,
  dateFrom: '',
  dateTo: '',
  destination: '',
  offers: [],
  isFavorite: false,
  type: 'flight',
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
  INIT: 'INIT',
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export {
  EVENT_TYPES,
  DEFAULT_EVENT,
  SortTypes,
  FilterTypes,
  UserAction,
  UpdateType,
  TimeLimit
};
