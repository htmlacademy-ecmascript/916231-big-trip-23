import EventsListPresenter from './presenter/events-list-presenter.js';
import EventsModel from './model/events-model.js';
import DestinationModel from './model/destination-model.js';
import OffersModel from './model/offers-model.js';

const siteMainElement = document.querySelector('.page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

const eventsModel = new EventsModel();
const destinationsModel = new DestinationModel();
const offersModel = new OffersModel();
const eventsListPresenter = new EventsListPresenter({
  eventsListContainer: tripEventsElement,
  eventsModel,
  destinationsModel,
  offersModel
});
eventsListPresenter.init();


