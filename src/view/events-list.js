import {createElement} from '../render.js';

function createEventsListPresenterElement() {
  return '<ul class="trip-events__list"></ul>';
}

export default class EventsList {
  getTemplate() {
    return createEventsListPresenterElement();
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
