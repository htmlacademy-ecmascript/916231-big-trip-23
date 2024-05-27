import Filters from '../view/filters.js';
import Sorting from '../view/sorting.js';
import EventsList from '../view/events-list.js';
import EventEdit from '../view/event-edit.js';
import Event from '../view/event.js';
import {render, replace} from '../framework/render.js';

const siteHeaderElement = document.querySelector('.page-header');
const siteMainElement = document.querySelector('.page-main');
const filtersWrapperElement = siteHeaderElement.querySelector('.trip-controls__filters');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

export default class eventsListPresenter {
  #eventsListComponent = new EventsList();

  #eventsListContainer = null;
  #eventList = null;
  #destinationList = null;
  #offersList = null;

  constructor({eventsListContainer, eventsModel, destinationsModel, offersModel}) {
    this.#eventsListContainer = eventsListContainer;
    this.#eventList = eventsModel.getEvents();
    this.#destinationList = destinationsModel.getDestinations();
    this.#offersList = offersModel.getOffers();
  }

  init() {
    this.#renderFilters();
    this.#renderSorting();
    this.#renderEventsList();
  }

  #renderFilters() {
    render(new Filters(), filtersWrapperElement);
  }

  #renderSorting() {
    render(new Sorting(), tripEventsElement);
  }

  #renderEventsList() {
    render(this.#eventsListComponent, this.#eventsListContainer);

    for (let i = 0; i < this.#eventList.length; i++) {
      this.#renderEvent(this.#eventList[i]);
    }
  }

  #renderEvent(event) {
    const eventPoint = new Event({event: event, destinationList: this.#destinationList, offersList: this.#offersList, onEditClick: toggleEdit});
    const eventEdit = new EventEdit({event: event, destinationList: this.#destinationList, offersList: this.#offersList, onSubmitClick: toggleView, onCancelClick: toggleView});

    const onEscKeydown = (evt) => {
      evt.preventDefault();
      toggleView();
    };

    function toggleEdit() {
      replace(eventEdit, eventPoint);
      document.addEventListener('keydown', onEscKeydown);
    }

    function toggleView() {
      replace(eventPoint, eventEdit);
      document.removeEventListener('keydown', onEscKeydown);
    }

    render(eventPoint, this.#eventsListComponent.element);
  }
}
