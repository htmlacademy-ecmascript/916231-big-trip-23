import dayjs from 'dayjs';

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

  let duration = '';
  duration += durationDays ? `${durationDays}D ` : '';
  duration += durationHours ? `${durationHours}H ` : '';
  duration += `${durationMinutes}M`;

  return duration;
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

const isEscapeKey = (evt) => evt.key === 'Escape';

const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

export {
  convertToDayOfMonth,
  convertToHourMinute,
  filterFuture,
  filterPresent,
  filterPast,
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
