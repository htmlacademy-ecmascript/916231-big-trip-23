import EventsListPresenter from './presenter/events-list-presenter.js';
import EventsModel from './model/events-model.js';

const siteMainElement = document.querySelector('.page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

const eventsModel = new EventsModel();
const eventsListPresenter = new EventsListPresenter({
  eventsListContainer: tripEventsElement,
  eventsModel
});
eventsListPresenter.init();


