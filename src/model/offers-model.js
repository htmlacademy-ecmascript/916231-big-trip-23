export default class OffersModel {
  #offers = null;
  #eventsApiService = null;

  constructor({eventsApiService}) {
    this.#eventsApiService = eventsApiService;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      this.#offers = await this.#eventsApiService.offers;
    } catch(err) {
      this.#offers = [];
    }
  }
}
