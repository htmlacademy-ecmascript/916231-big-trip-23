import Event from '../view/event.js';
import EventEdit from '../view/event-edit.js';
import {render, replace, remove} from '../framework/render.js';
import {isEscapeKey, isDatesEqual} from '../utils.js';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class EventPresenter {
  #eventsListContainer = null;
  #event = null;
  #eventPoint = null;
  #eventEdit = null;
  #destinationList = null;
  #offersList = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #mode = Mode.DEFAULT;

  constructor({eventsListContainer, destinationsModel, offersModel, onDataChange, onModeChange}) {
    this.#eventsListContainer = eventsListContainer;
    this.#destinationList = destinationsModel;
    this.#offersList = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(event) {
    this.#event = event;

    const prevEventPoint = this.#eventPoint;
    const prevEventEdit = this.#eventEdit;

    this.#eventPoint = new Event({
      event: this.#event,
      destinationList: this.#destinationList,
      offersList: this.#offersList,
      onEditClick: this.#toggleEdit,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#eventEdit = new EventEdit({
      event: this.#event,
      destinationList: this.#destinationList,
      offersList: this.#offersList,
      onSubmitClick: this.#onSubmitClick,
      onCancelClick: this.#onCancelClick,
      onDeleteClick: this.#onDeleteClick,
    });

    if(prevEventPoint === null || prevEventEdit === null) {
      render(this.#eventPoint, this.#eventsListContainer.element);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventPoint, prevEventPoint);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#eventEdit, prevEventEdit);
    }

    remove(prevEventPoint);
    remove(prevEventEdit);
  }

  destroy() {
    remove(this.#eventPoint);
    remove(this.#eventEdit);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#toggleView();
    }
  }

  #onEscKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#eventEdit.reset(this.#event);
      this.#toggleView();
    }
  };

  #toggleEdit = () => {
    replace(this.#eventEdit, this.#eventPoint);
    document.addEventListener('keydown', this.#onEscKeydown);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  };

  #toggleView = () => {
    replace(this.#eventPoint, this.#eventEdit);
    document.removeEventListener('keydown', this.#onEscKeydown);
    this.#mode = Mode.DEFAULT;
  };

  #onSubmitClick = (update) => {
    const isMinorUpdate = !isDatesEqual(this.#event.dateFrom, update.dateFrom);
    this.#handleDataChange(
      UserAction.UPDATE_EVENT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
    this.#toggleView();
  };

  #onCancelClick = () => {
    this.#eventEdit.reset(this.#event);
    this.#toggleView();
  };

  #onDeleteClick = (event) => {
    this.#handleDataChange(UserAction.DELETE_EVENT, UpdateType.MINOR, event);
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(UserAction.UPDATE_EVENT, UpdateType.MINOR, {...this.#event, isFavorite: !this.#event.isFavorite});
  };
}
