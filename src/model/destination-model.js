export default class DestinationModel {
  #destinations = null;
  #eventsApiService = null;

  constructor({eventsApiService}) {
    this.#eventsApiService = eventsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      this.#destinations = await this.#eventsApiService.destinations;
    } catch(err) {
      this.#destinations = [];
    }
  }
}
