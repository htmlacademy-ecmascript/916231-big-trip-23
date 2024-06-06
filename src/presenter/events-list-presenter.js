import Filters from '../view/filters.js';
import Sorting from '../view/sorting.js';
import EventsList from '../view/events-list.js';
import EventPresenter from './event-presenter.js';
import {render} from '../framework/render.js';
import {updateItem, sortDay, sortTime, sortPrice} from '../utils.js';
import {SortTypes} from '../const.js';

const siteHeaderElement = document.querySelector('.page-header');
const siteMainElement = document.querySelector('.page-main');
const filtersWrapperElement = siteHeaderElement.querySelector('.trip-controls__filters');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

export default class EventsListPresenter {
  #eventsListComponent = new EventsList();

  #eventsListContainer = null;
  #eventList = null;
  #destinationList = null;
  #offersList = null;
  #sortComponent = null;
  #sourcedEvents = null;

  #eventPresenters = new Map();

  constructor({eventsListContainer, eventsModel, destinationsModel, offersModel}) {
    this.#eventsListContainer = eventsListContainer;
    this.#eventList = eventsModel.events;
    this.#destinationList = destinationsModel.getDestinations();
    this.#offersList = offersModel.getOffers();
  }

  init() {
    this.#renderFilters();
    this.#renderSorting();

    this.#eventList.sort(sortDay);
    this.#sourcedEvents = [...this.#eventList];
    this.#renderEventsList();
  }

  #renderFilters() {
    render(new Filters(), filtersWrapperElement);
  }

  #renderSorting() {
    this.#sortComponent = new Sorting({onSortTypeChange: this.#handleSortTypeChange});

    render(this.#sortComponent, tripEventsElement);
  }

  #renderEventsList() {
    render(this.#eventsListComponent, this.#eventsListContainer);

    for (let i = 0; i < this.#eventList.length; i++) {
      this.#renderEvent(this.#eventList[i]);
    }
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      eventsListContainer: this.#eventsListComponent,
      destinationsModel: this.#destinationList,
      offersModel: this.#offersList,
      onDataChange: this.#handleEventChange,
      onModeChange: this.#handleModeChange
    });
    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #handleEventChange = (updatedEvent) => {
    this.#eventList = updateItem(this.#eventList, updatedEvent);
    this.#eventPresenters.get(updatedEvent.id).init(updatedEvent);
  };

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    this.#sortTasks(sortType);
    this.#clearEventList();
    this.#renderEventsList();
  };

  #clearEventList() {
    this.#eventPresenters.forEach((eventPresenter) => eventPresenter.destroy());
    this.#eventPresenters.clear();
  }

  #sortTasks(sortType) {
    switch (sortType) {
      case SortTypes.DAY:
        this.#eventList = [...this.#sourcedEvents];
        break;
      case SortTypes.TIME:
        this.#eventList.sort(sortTime);
        break;
      case SortTypes.PRICE:
        this.#eventList.sort(sortPrice);
        break;
    }
  }
}
