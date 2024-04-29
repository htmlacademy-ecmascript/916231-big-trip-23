import EventsListPresenter from './presenter/events-list-presenter.js';

const siteMainElement = document.querySelector('.page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

const eventsListPresenter = new EventsListPresenter({eventsListContainer: tripEventsElement});
eventsListPresenter.init();


