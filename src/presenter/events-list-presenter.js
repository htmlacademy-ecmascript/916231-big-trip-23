import Sorting from '../view/sorting.js';
import EventsList from '../view/events-list.js';
import NoEvent from '../view/no-event.js';
import Loading from '../view/loading.js';
import ErrorMessage from '../view/error-message.js';
import EventPresenter from './event-presenter.js';
import NewEventPresenter from './new-event-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import {render, remove} from '../framework/render.js';
import {sortDay, sortTime, sortPrice, filterFuture, filterPresent, filterPast} from '../utils.js';
import {FilterTypes, SortTypes, UpdateType, UserAction, TimeLimit} from '../const.js';

const siteMainElement = document.querySelector('.page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

export default class EventsListPresenter {
  #eventsListComponent = new EventsList();

  #eventsListContainer = null;
  #eventsModel = null;
  #destinationsModel = null;
  #offersList = null;
  #filterModel = null;
  #sortComponent = null;
  #noEventComponent = null;
  #loadingComponent = new Loading();
  #errorMessageComponent = new ErrorMessage();

  #currentSortType = SortTypes.DAY;
  #currentFilterType = FilterTypes.EVERYTHING;

  #eventPresenters = new Map();
  #newEventPresenter = null;

  #isLoading = true;
  #isErrorLoad = false;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({eventsListContainer, eventsModel, destinationsModel, offersModel, filterModel, onNewEventDestroy}) {
    this.#eventsListContainer = eventsListContainer;
    this.#eventsModel = eventsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersList = offersModel;
    this.#filterModel = filterModel;

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#newEventPresenter = new NewEventPresenter({
      eventListContainer: this.#eventsListComponent.element,
      event: this.#eventsModel.events,
      destinationList: this.#destinationsModel,
      offersList: this.#offersList,
      onSubmitClick: this.#handleViewAction,
      onDestroy: onNewEventDestroy
    });
  }

  init() {
    this.#renderEventsList();
  }

  createEvent() {
    this.#currentSortType = SortTypes.DAY;
    this.#currentFilterType = FilterTypes.EVERYTHING;

    render(this.#eventsListComponent, this.#eventsListContainer);
    remove(this.#noEventComponent);

    this.#filterModel.setFilter(UpdateType.MAJOR, this.#currentFilterType);
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

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventPresenters.get(update.id).setSaving();
        try {
          await this.#eventsModel.updateEvent(updateType, update);
        }catch(err) {
          this.#eventPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_EVENT:
        this.#newEventPresenter.setSaving();
        try {
          await this.#eventsModel.addEvent(updateType, update);
        } catch(err) {
          this.#newEventPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_EVENT:
        this.#eventPresenters.get(update.id).setDeleting();
        try {
          await this.#eventsModel.deleteEvent(updateType, update);
        } catch(err) {
          this.#eventPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#isErrorLoad = data;
        remove(this.#loadingComponent);
        this.#clearEventList();
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

  #renderSorting() {
    this.#sortComponent = new Sorting({onSortTypeChange: this.#handleSortTypeChange, currentSort: this.#currentSortType});

    render(this.#sortComponent, tripEventsElement);
  }

  #renderEventsList() {
    const eventList = this.events;

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if(this.#isErrorLoad) {
      this.#renderErrorMessage();
      return;
    }

    if(eventList.length === 0) {
      this.#renderNoEvent();
      remove(this.#sortComponent);
      return;
    }

    remove(this.#errorMessageComponent);

    this.#renderSorting();
    render(this.#eventsListComponent, this.#eventsListContainer);

    for (let i = 0; i < eventList.length; i++) {
      this.#renderEvent(eventList[i]);
    }
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      eventsListContainer: this.#eventsListComponent,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersList,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #renderNoEvent() {
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterTypes.EVERYTHING);
    this.#noEventComponent = new NoEvent({
      filterType: this.#currentFilterType
    });

    render(this.#noEventComponent, this.#eventsListContainer);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#eventsListContainer);
  }

  #renderErrorMessage() {
    render(this.#errorMessageComponent, this.#eventsListContainer);
  }

  #clearEventList(resetSortType = false) {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((eventPresenter) => eventPresenter.destroy());
    this.#eventPresenters.clear();

    if (resetSortType) {
      this.#currentSortType = SortTypes.DAY;
    }

    remove(this.#sortComponent);
    remove(this.#noEventComponent);
    remove(this.#loadingComponent);
  }
}
