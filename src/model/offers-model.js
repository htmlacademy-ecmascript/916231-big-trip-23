import {getOffer} from '../mock/offer.js';

export default class OffersModel {
  #offers = null;

  constructor() {
    this.#offers = getOffer();
  }

  getOffers() {
    return this.#offers;
  }
}
