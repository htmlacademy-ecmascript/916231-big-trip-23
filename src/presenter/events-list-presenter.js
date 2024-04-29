import Filters from '../view/fitlers.js';
import Sorting from '../view/sorting.js';
import EventsList from '../view/events-list.js';
import EventEdit from '../view/event-edit.js';
import Event from '../view/event.js';
import {render} from '../render.js';

const siteHeaderElement = document.querySelector('.page-header');
const siteMainElement = document.querySelector('.page-main');
const filtersWrapperElement = siteHeaderElement.querySelector('.trip-controls__filters');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

export default class eventsListPresenter {
  eventsListComponent = new EventsList();

  constructor({eventsListContainer}) {
    this.eventsListContainer = eventsListContainer;
  }

  init() {
    render(new Filters(), filtersWrapperElement);
    render(new Sorting(), tripEventsElement);
    render(this.eventsListComponent, this.eventsListContainer);
    render(new EventEdit(), this.eventsListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new Event(), this.eventsListComponent.getElement());
    }
  }
}
