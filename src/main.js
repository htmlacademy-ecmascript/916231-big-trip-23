import EventsListPresenter from './presenter/events-list-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import EventsModel from './model/events-model.js';
import DestinationModel from './model/destination-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import NewEventButtonView from './view/new-event-button-view.js';
import {render} from './framework/render.js';
import EventsApiService from './events-api-service.js';

const AUTHORIZATION = 'Basic fghhtgrfd99';
const END_POINT = 'https://23.objects.htmlacademy.pro/big-trip';

const siteMainElement = document.querySelector('.page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');
const siteHeaderElement = document.querySelector('.page-header');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const filtersWrapperElement = siteHeaderElement.querySelector('.trip-controls__filters');

const eventsModel = new EventsModel({
  eventsApiService: new EventsApiService(END_POINT, AUTHORIZATION)
});

const destinationsModel = new DestinationModel({
  eventsApiService: new EventsApiService(END_POINT, AUTHORIZATION)
});

const offersModel = new OffersModel({
  eventsApiService: new EventsApiService(END_POINT, AUTHORIZATION)
});

const filterModel = new FilterModel();

const eventsListPresenter = new EventsListPresenter({
  eventsListContainer: tripEventsElement,
  eventsModel,
  destinationsModel,
  offersModel,
  filterModel,
  onNewEventDestroy: handleNewEventFormClose,
});

const filterPresenter = new FilterPresenter({
  filterContainer: filtersWrapperElement,
  filterModel,
  eventsModel
});

const newEventButtonComponent = new NewEventButtonView({
  onClick: handleNewEventButtonClick
});

function handleNewEventFormClose() {
  newEventButtonComponent.element.disabled = false;
}

function handleNewEventButtonClick() {
  eventsListPresenter.createEvent();
  newEventButtonComponent.element.disabled = true;
}

filterPresenter.init();
eventsListPresenter.init();
destinationsModel.init().finally(() => {
  offersModel.init().finally(() => {
    eventsModel.init()
      .finally(() => {
        render(newEventButtonComponent, tripMainElement);
      });
  });
});

