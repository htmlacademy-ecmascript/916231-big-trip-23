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

  constructor({eventsListContainer, eventsModel}) {
    this.eventsListContainer = eventsListContainer;
    this.eventsModel = eventsModel;
  }

  init() {
    const eventList = this.eventsModel.getEvents();
    const destinationList = this.eventsModel.getDestinations();
    const offersList = this.eventsModel.getOffers();
    render(new Filters(), filtersWrapperElement);
    render(new Sorting(), tripEventsElement);
    render(this.eventsListComponent, this.eventsListContainer);
    render(new EventEdit({event: eventList[0], destinationList: destinationList, offersList: offersList}), this.eventsListComponent.getElement());

    for (let i = 0; i < eventList.length; i++) {
      render(new Event({event: eventList[i], destinationList: destinationList, offersList: offersList}), this.eventsListComponent.getElement());
    }
  }
}
