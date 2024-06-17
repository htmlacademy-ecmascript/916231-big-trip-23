import AbstractView from '../framework/view/abstract-view.js';
import {getTotalPrice, getRoute, getDurationRoute} from '../utils.js';

function createTripInfoTemplate(events, offers, destinations) {
  const totalPrice = getTotalPrice(events, offers);
  const route = getRoute(events, destinations);
  const duration = getDurationRoute(events);

  return (`<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${route}</h1>

              <p class="trip-info__dates">${duration}</p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
            </p>
          </section>`
  );
}

export default class TripInfo extends AbstractView {
  #events = null;
  #offers = null;
  #destinations = null;

  constructor({events, offers, destinations}) {
    super();
    this.#events = events;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  get template() {
    return createTripInfoTemplate(this.#events, this.#offers, this.#destinations);
  }
}
