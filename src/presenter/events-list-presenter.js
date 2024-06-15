import Sorting from '../view/sorting.js';
import EventsList from '../view/events-list.js';
import NoEvent from '../view/no-event.js';
import EventPresenter from './event-presenter.js';
import NewEventPresenter from './new-event-presenter.js';
import {render, remove} from '../framework/render.js';
import {sortDay, sortTime, sortPrice, filterFuture, filterPresent, filterPast} from '../utils.js';
import {FilterTypes, SortTypes, UpdateType, UserAction} from '../const.js';

const siteMainElement = document.querySelector('.page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

export default class EventsListPresenter {
  #eventsListComponent = new EventsList();

  #eventsListContainer = null;
  #eventsModel = null;
  #destinationList = null;
  #offersList = null;
  #filterModel = null;
  #sortComponent = null;
  #noEventComponent = null;

  #currentSortType = SortTypes.DAY;
  #currentFilterType = FilterTypes.EVERYTHING;

  #eventPresenters = new Map();
  #newEventPresenter = null;

  constructor({eventsListContainer, eventsModel, destinationsModel, offersModel, filterModel, onNewEventDestroy}) {
    this.#eventsListContainer = eventsListContainer;
    this.#eventsModel = eventsModel;
    this.#destinationList = destinationsModel.getDestinations();
    this.#offersList = offersModel.getOffers();
    this.#filterModel = filterModel;

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#newEventPresenter = new NewEventPresenter({
      eventListContainer: this.#eventsListComponent.element,
      event: this.#eventsModel.events,
      destinationList: this.#destinationList,
      offersList: this.#offersList,
      onSubmitClick: this.#handleViewAction,
      onDestroy: onNewEventDestroy
    });
  }

  init() {
    this.#renderSorting();

    this.#renderEventsList();
  }

  createEvent() {
    this.#currentSortType = SortTypes.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterTypes.EVERYTHING);
    this.#newEventPresenter.init();
  }

  get events() {
    this.#currentFilterType = this.#filterModel.filter;
    const events = this.#eventsModel.events;

    let filteredEvents;

    switch (this.#currentFilterType) {
      case FilterTypes.EVERYTHING:
        filteredEvents = events;
        break;
      case FilterTypes.FUTURE:
        filteredEvents = filterFuture(events);
        break;
      case FilterTypes.PRESENT:
        filteredEvents = filterPresent(events);
        break;
      case FilterTypes.PAST:
        filteredEvents = filterPast(events);
        break;
    }

    switch (this.#currentSortType) {
      case SortTypes.DAY:
        return filteredEvents.sort(sortDay);
      case SortTypes.TIME:
        return filteredEvents.sort(sortTime);
      case SortTypes.PRICE:
        return filteredEvents.sort(sortPrice);
    }

    return filteredEvents;
  }

  #renderSorting() {
    this.#sortComponent = new Sorting({onSortTypeChange: this.#handleSortTypeChange});

    render(this.#sortComponent, tripEventsElement);
  }

  #renderEventsList() {
    const eventList = this.events;

    if(eventList.length === 0) {
      this.#renderNoEvent();
      return;
    }

    render(this.#eventsListComponent, this.#eventsListContainer);

    for (let i = 0; i < eventList.length; i++) {
      this.#renderEvent(eventList[i]);
    }
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      eventsListContainer: this.#eventsListComponent,
      destinationsModel: this.#destinationList,
      offersModel: this.#offersList,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #renderNoEvent() {
    this.#noEventComponent = new NoEvent({
      filterType: this.#currentFilterType
    });

    render(this.#noEventComponent, this.#eventsListContainer);
  }

  #clearEventList(resetSortType = false) {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((eventPresenter) => eventPresenter.destroy());
    this.#eventPresenters.clear();
    if (resetSortType) {
      this.#currentSortType = SortTypes.DAY;
    }
    this.#currentFilterType = FilterTypes.EVERYTHING;
    remove(this.#noEventComponent);
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this.#eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this.#eventsModel.deleteEvent(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearEventList();
        this.#renderEventsList();
        break;
      case UpdateType.MAJOR:
        this.#clearEventList({resetSortType: true});
        this.#renderEventsList();
        break;
    }
  };

  #handleModeChange = () => {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    this.#currentSortType = sortType;
    this.#clearEventList();
    this.#renderEventsList();
  };
}
