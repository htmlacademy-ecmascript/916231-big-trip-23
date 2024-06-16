import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {convertToDateTime} from '../utils.js';
import {EVENT_TYPES, DEFAULT_EVENT} from '../const.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

function getEventTypeTitle(eventType) {
  return eventType.charAt(0).toUpperCase() + eventType.slice(1);
}

function createDestinationTemplate(destination) {
  return `${destination?.description || destination?.pictures.length ?
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${destination.description ? `
      <p class="event__destination-description">${destination.description}</p>` : ''}
      ${destination.pictures ? `
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${destination.pictures.map((picture) => (`
          <img class="event__photo" src="${picture.src}" alt="${picture.description}">
        `)).join('')}
        </div>
      </div>` : ''}
    </section>` : ''}`;
}

function createOffersTemplate(currentOffers, checkedOffers, isDisabled) {
  return `${currentOffers.length ?
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${currentOffers.map((offer) => (`
        <div class="event__offer-selector">
          <input
            class="event__offer-checkbox
            visually-hidden"
            id="event-offer-${offer.title}"
            type="checkbox"
            name="event-offer-${offer.title}"
            ${checkedOffers?.includes(offer.id) ? 'checked' : ''}
            data-offer-id="${offer.id}"
            ${isDisabled ? 'disabled' : ''}
          >
          <label class="event__offer-label" for="event-offer-${offer.title}">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>
        `)).join('')}
      </div>
    </section>` : ''}`;
}

function createEventEditElement(state, destinationList, offersList, isNewEvent, isSubmitDisabled) {
  const {
    basePrice,
    dateFrom,
    dateTo,
    destination,
    offers,
    type,
    isDisabled,
    isSaving,
    isDeleting
  } = state;

  const price = basePrice || 0;
  const currentType = type;

  const currentDestination = destinationList.find((destinationItem) => destinationItem.id === destination);

  const typeOffers = offersList.find((offer) => offer.type === type);
  const currentOffers = typeOffers ? typeOffers.offers : [];
  const checkedOffers = offers;

  const startDayTime = convertToDateTime(dateFrom);
  const endDayTime = convertToDateTime(dateTo);

  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-1">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="img/icons/${currentType.toLowerCase()}.png" alt="Event type icon">
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                  <div class="event__type-list">
                    <fieldset class="event__type-group">
                      <legend class="visually-hidden">Event type</legend>
                      ${EVENT_TYPES.map((eventType) => (`
                      <div class="event__type-item">
                        <input
                          id="event-type-${eventType}-1"
                          class="event__type-input
                          visually-hidden"
                          type="radio"
                          name="event-type"
                          value="${eventType}"
                          ${eventType === currentType ? 'checked' : ''}
                          ${isDisabled ? 'disabled' : ''}
                        >
                        <label class="event__type-label event__type-label--${eventType}" for="event-type-${eventType}-1">
                          ${getEventTypeTitle(eventType)}
                        </label>
                      </div>
                      `)).join('')}
                    </fieldset>
                  </div>
                </div>

                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-1">
                    ${currentType}
                  </label>
                  <input
                    class="event__input
                    event__input--destination"
                    id="event-destination-1"
                    type="text"
                    name="event-destination"
                    value="${currentDestination ? currentDestination.name : ''}"
                    list="destination-list-1"
                    ${isDisabled ? 'disabled' : ''}
                  >
                  ${destinationList ? `
                  <datalist id="destination-list-1">
                    ${destinationList.map((eventDestination) => (`
                    <option value="${eventDestination.name}"></option>
                    `)).join('')}
                  </datalist>` : ''}
                </div>

                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-1">From</label>
                  <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDayTime}" ${isDisabled ? 'disabled' : ''}>
                  &mdash;
                  <label class="visually-hidden" for="event-end-time-1">To</label>
                  <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDayTime}" ${isDisabled ? 'disabled' : ''}>
                </div>

                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-1">
                    <span class="visually-hidden">Price</span>
                    &euro;
                  </label>
                  <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}" ${isDisabled ? 'disabled' : ''}>
                </div>

                <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled || isSubmitDisabled ? '' : 'disabled'}>${isSaving ? 'Saving...' : 'Save'}</button>
                ${isNewEvent ? `
                  <button class="event__reset-btn" type="reset">Cancel</button>` : `
                  <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
                  <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
                    <span class="visually-hidden">Open event</span>
                  </button>
                `}
              </header>
              <section class="event__details">
                ${createOffersTemplate(currentOffers, checkedOffers, isDisabled)}
                ${createDestinationTemplate(currentDestination)}
              </section>
            </form>
            </li>`;
}

export default class EventEdit extends AbstractStatefulView {
  #destinationList = null;
  #offersList = null;
  #handleSubmitClick = null;
  #handleCancelClick = null;
  #handleDeleteClick = null;
  #dateFromPicker = null;
  #dateToPicker = null;
  #isNewEvent = false;

  constructor({
    event = DEFAULT_EVENT,
    destinationList,
    offersList, onSubmitClick,
    onCancelClick,
    onDeleteClick,
    isNewEvent = false
  }) {
    super();
    this.#destinationList = destinationList.destinations;
    this.#offersList = offersList.offers;
    this.#handleSubmitClick = onSubmitClick;
    this.#handleCancelClick = onCancelClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#isNewEvent = isNewEvent;

    this._setState({...EventEdit.parseEventToState(event)});
    this._restoreHandlers();
  }

  get template() {
    return createEventEditElement(this._state, this.#destinationList, this.#offersList, this.#isNewEvent, this.#isValidForm());
  }

  removeElement() {
    super.removeElement();

    if (this.#dateFromPicker) {
      this.#dateFromPicker.destroy();
      this.#dateFromPicker = null;
    }

    if (this.#dateToPicker) {
      this.#dateToPicker.destroy();
      this.#dateToPicker = null;
    }
  }

  reset(event) {
    this.updateElement(
      EventEdit.parseEventToState(event),
    );
  }

  _restoreHandlers() {
    this.element.querySelector('.event__save-btn')?.addEventListener('click', this.#clickSubmitHandler);
    this.element.querySelector('.event__reset-btn')?.addEventListener('click', this.#clickDeleteHandler);
    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#clickCancelHandler);
    this.element.querySelector('.event__type-group')?.addEventListener('change', this.#changeTypeHandler);
    this.element.querySelector('.event__input--destination')?.addEventListener('change', this.#changeDestinationHandler);
    this.element.querySelector('.event__input--price')?.addEventListener('change', this.#changePriceHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#changeOfferHandler);

    this.#setDatepicker();
  }

  #clickSubmitHandler = (evt) => {
    evt.preventDefault();

    this.#handleSubmitClick(EventEdit.parseStateToEvent(this._state));
  };

  #clickCancelHandler = (evt) => {
    evt.preventDefault();
    this.#handleCancelClick();
  };

  #clickDeleteHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EventEdit.parseStateToEvent(this._state));
  };

  #changeTypeHandler = (evt) => {
    this.updateElement({
      ...this._state,
      type: evt.target.value,
    });
  };

  #changeDestinationHandler = (evt) => {
    const newDestination = this.#destinationList.find((destinationItem) => destinationItem.name === evt.target.value);
    const newDestinationId = newDestination ? newDestination.id : '';

    this.updateElement({
      ...this._state,
      destination: newDestinationId,
    });
  };

  #dateFromChangeHandler = ([userDate]) => {
    userDate = userDate || this._state.dateFrom;

    this.updateElement({
      ...this._state,
      dateFrom: userDate,
    });

    this.#setDatepicker();
  };

  #dateToChangeHandler = ([userDate]) => {
    userDate = userDate || this._state.dateTo;

    this.updateElement({
      ...this._state,
      dateTo: userDate,
    });

    this.#setDatepicker();
  };

  #changePriceHandler = (evt) => {
    const basePrice = evt.target.value;

    this.updateElement({
      ...this._state,
      basePrice: Number(basePrice)
    });
  };

  #changeOfferHandler = (evt) => {
    evt.preventDefault();
    const offerId = evt.target.dataset.offerId;

    let newOffers;
    if(evt.target.checked) {
      newOffers = [...this._state.offers, offerId];
    } else {
      newOffers = [...this._state.offers.filter((id) => id !== offerId)];
    }

    this.updateElement({
      offers: newOffers,
    });
  };

  #setDatepicker() {
    this.#dateFromPicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
        onChange: this.#dateFromChangeHandler,
      },
    );

    this.#dateToPicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler,
      },
    );
  }

  #isValidForm() {
    const isValidDestination = !!this._state.destination;
    const isValidDateFrom = !!this._state.dateFrom;
    const isValidDateTo = !!this._state.dateTo;
    const isValidPrice = this._state.basePrice > 0;

    return isValidDestination && isValidDateFrom && isValidDateTo && isValidPrice;
  }

  static parseEventToState(event) {
    return {...event,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToEvent(state) {
    const event = {...state};

    delete event.isDisabled;
    delete event.isSaving;
    delete event.isDeleting;

    return event;
  }
}
