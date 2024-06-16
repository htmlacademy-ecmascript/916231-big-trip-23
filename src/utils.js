import dayjs from 'dayjs';
import { FilterTypes } from './const.js';

const DAY_MONTH_FORMAT = 'MMM D';
const HOUR_MINUTE_FORMAT = 'HH:mm';
const DATE_TIME_FORMAT = 'DD/MM/YY HH:mm';
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
    return `${durationDays.toString().padStart(2, '0')}D ${durationHours.toString().padStart(2, '0')}H ${durationMinutes.toString().padStart(2, '0')}M`;
  } else if (durationHours > 0) {
    return `${durationHours.toString().padStart(2, '0')}H ${durationMinutes.toString().padStart(2, '0')}M`;
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
  isDatesEqual
};
