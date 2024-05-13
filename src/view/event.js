import {createElement} from '../render.js';
import {convertToDayOfMonth, convertToHourMinute, getEventDuration} from '../utils.js';

function createEventElement(event, destinationList, offersList) {
  const {basePrice, dateFrom, dateTo, isFavorite, type} = event;
  const currentDestination = destinationList.find((destinationItem) => destinationItem.id === event.destination);
  const typeOffers = offersList.find((offer) => offer.type === event.type);
  const currentOffers = typeOffers.offers.filter((offer) => event.offers.includes(offer.id));

  const startTimeDayOfMonth = convertToDayOfMonth(dateFrom);
  const startTimeHourMinute = convertToHourMinute(dateFrom);
  const endTimeHourMinute = convertToHourMinute(dateTo);

  const duration = getEventDuration(dateFrom, dateTo);

  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';

  return `<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="${dateFrom}">${startTimeDayOfMonth}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${currentDestination.name}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${dateFrom}">${startTimeHourMinute}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${dateTo}">${endTimeHourMinute}</time>
                  </p>
                  <p class="event__duration">${duration}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                ${currentOffers.map((offer) => (
    `<li class="event__offer">
                    <span class="event__offer-title">${offer.title}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${offer.price}</span>
                  </li>`
  )).join('')}

                </ul>
                <button class="event__favorite-btn ${favoriteClassName}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`;
}

export default class Event {
  constructor({event, destinationList, offersList}) {
    this.event = event;
    this.destinationList = destinationList;
    this.offersList = offersList;
  }

  getTemplate() {
    return createEventElement(this.event, this.destinationList, this.offersList);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
