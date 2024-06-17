import dayjs from 'dayjs';
import { FilterTypes } from './const.js';

const DAY_MONTH_FORMAT = 'MMM D';
const HOUR_MINUTE_FORMAT = 'HH:mm';
const DATE_TIME_FORMAT = 'DD/MM/YY HH:mm';
const COUNT_DESTINATION_ROUTE = 3;
const FORMAT_SYMBOL_COUNT = 2;
const NUMBER_HOURS_IN_DAY = 24;
const NUMBER_MINUTES_IN_HOUR = 60;
const CURRENT_DATE = dayjs();

const convertToDayOfMonth = (date) => date ? dayjs(date).format(DAY_MONTH_FORMAT) : '';

const convertToHourMinute = (date) => date ? dayjs(date).format(HOUR_MINUTE_FORMAT) : '';

const convertToDateTime = (date) => date ? dayjs(date).format(DATE_TIME_FORMAT) : '';

const getEventDuration = (dateFrom, dateTo) => {
  const durationDays = dayjs(dateTo).diff(dateFrom, 'd');
  const durationHours = dayjs(dateTo).diff(dateFrom, 'h') % NUMBER_HOURS_IN_DAY;
  const durationMinutes = dayjs(dateTo).diff(dateFrom, 'm') % NUMBER_MINUTES_IN_HOUR;

  if (durationDays > 0) {
    return `${durationDays.toString().padStart(FORMAT_SYMBOL_COUNT, '0')}D
            ${durationHours.toString().padStart(FORMAT_SYMBOL_COUNT, '0')}H
            ${durationMinutes.toString().padStart(FORMAT_SYMBOL_COUNT, '0')}M`;
  } else if (durationHours > 0) {
    return `${durationHours.toString().padStart(FORMAT_SYMBOL_COUNT, '0')}H
            ${durationMinutes.toString().padStart(FORMAT_SYMBOL_COUNT, '0')}M`;
  } else {
    return `${durationMinutes}M`;
  }
};

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const sortDay = (eventA, eventB) => dayjs(eventA.dateFrom).diff(dayjs(eventB.dateFrom));

const sortTime = (eventA, eventB) => {
  const diffA = dayjs(eventA.dateTo).diff(dayjs(eventA.dateFrom));
  const diffB = dayjs(eventB.dateTo).diff(dayjs(eventB.dateFrom));

  return diffB - diffA;
};

const sortPrice = (eventA, eventB) => eventB.basePrice - eventA.basePrice;

const filterFuture = (events) => events.filter((event) => dayjs(event.dateFrom).diff(CURRENT_DATE) > 0);

const filterPast = (events) => events.filter((event) => dayjs(CURRENT_DATE).diff(event.dateTo) > 0);

const filterPresent = (events) => events.filter((event) => dayjs(CURRENT_DATE).diff(event.dateFrom) >= 0).filter((event) => dayjs(event.dateTo).diff(CURRENT_DATE) >= 0);

const getEventFilterCount = (events, filterType) => {
  switch (filterType) {
    case FilterTypes.EVERYTHING:
      return events.length;
    case FilterTypes.FUTURE:
      return filterFuture(events).length;
    case FilterTypes.PRESENT:
      return filterPresent(events).length;
    case FilterTypes.PAST:
      return filterPast(events).length;
  }
};

const isEscapeKey = (evt) => evt.key === 'Escape';

const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

const getTotalPrice = (events, offers) => {
  let totalPrice = events.reduce((sum, event) => sum + event.basePrice, 0);

  events.map((event) => {
    const currentOffers = offers.find((offer) => offer.type === event.type).offers;
    currentOffers.map((offer) => {
      if (event.offers.includes(offer.id)){
        totalPrice += offer.price;
      }
    });
  });

  return totalPrice;
};

const getRoute = (events, destinations) => {
  const currentIdDestinations = [];
  events.map((event) => currentIdDestinations.push(event.destination));

  const currentDestinations = destinations.filter((destination) => currentIdDestinations.includes(destination.id));

  if(currentDestinations.length > COUNT_DESTINATION_ROUTE) {
    return `${currentDestinations[0].name } &mdash; ... &mdash; ${ currentDestinations[currentDestinations.length - 1].name}`;
  } else {
    let resultRoute = '';

    currentDestinations.map((destination) => {
      resultRoute += `${destination.name } &mdash; `;
    });

    const lastSeparator = resultRoute.lastIndexOf(' &mdash; ');
    resultRoute = resultRoute.substring(0, lastSeparator);

    return resultRoute;
  }
};

export {
  convertToDayOfMonth,
  convertToHourMinute,
  filterFuture,
  filterPresent,
  filterPast,
  getEventFilterCount,
  convertToDateTime,
  getEventDuration,
  getRandomArrayElement,
  getRandomInteger,
  sortDay,
  sortTime,
  sortPrice,
  isEscapeKey,
  isDatesEqual,
  getTotalPrice,
  getRoute
};
