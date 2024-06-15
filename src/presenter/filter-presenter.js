import {render, } from '../framework/render.js';
import Filters from '../view/filters.js';
import {FilterTypes, UpdateType} from '../const.js';
import {getEventFilterCount} from '../utils.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #eventsModel = null;
  #currentFilter = FilterTypes.EVERYTHING;

  #filterComponent = null;

  constructor({filterContainer, filterModel, eventsModel}) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#eventsModel = eventsModel;

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const events = this.#eventsModel.events;

    return Object.values(FilterTypes).map((type) => ({
      type,
      count: getEventFilterCount(events, type)
    }));
  }

  init() {
    const filters = this.filters;
    const currentFilter = this.#currentFilter;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new Filters({
      filters,
      currentFilter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);

    }
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#currentFilter = filterType;

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
