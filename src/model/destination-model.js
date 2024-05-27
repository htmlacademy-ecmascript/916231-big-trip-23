import {getDestination} from '../mock/destination.js';

export default class DestinationModel {
  #destinations = null;

  constructor() {
    this.#destinations = getDestination();
  }

  getDestinations() {
    return this.#destinations;
  }
}
