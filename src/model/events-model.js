import {getRandomEvent} from '../mock/event.js';
import {getDestination} from '../mock/destination.js';
import {getOffer} from '../mock/offer.js';

const EVENT_COUNT = 3;

export default class EventsModel {
  constructor() {
    this.events = Array.from({length: EVENT_COUNT}, getRandomEvent);
    this.destinations = getDestination();
    this.offers = getOffer();
  }

  getEvents() {
    return this.events;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }
}
