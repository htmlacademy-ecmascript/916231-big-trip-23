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
  #destinationsModel = null;
  #offersModel = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #mode = Mode.DEFAULT;

  constructor({eventsListContainer, destinationsModel, offersModel, onDataChange, onModeChange}) {
    this.#eventsListContainer = eventsListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(event) {
    this.#event = event;

    const prevEventPoint = this.#eventPoint;
    const prevEventEdit = this.#eventEdit;

    this.#eventPoint = new Event({
      event: this.#event,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onEditClick: this.#toggleEdit,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#eventEdit = new EventEdit({
      event: this.#event,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
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
      replace(this.#eventPoint, prevEventEdit);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevEventPoint);
    remove(prevEventEdit);
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#eventEdit.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#eventEdit.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#eventPoint.shake();
      return;
    }

    const resetFormState = () => {
      this.#eventEdit.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#eventEdit.shake(resetFormState);
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

  #documentKeydownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#eventEdit.reset(this.#event);
      this.#toggleView();
    }
  };

  #toggleEdit = () => {
    replace(this.#eventEdit, this.#eventPoint);
    document.addEventListener('keydown', this.#documentKeydownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  };

  #toggleView = () => {
    replace(this.#eventPoint, this.#eventEdit);
    document.removeEventListener('keydown', this.#documentKeydownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #onSubmitClick = (update) => {
    const isMinorUpdate = !isDatesEqual(this.#event.dateFrom, update.dateFrom) && !isDatesEqual(this.#event.dateTo, update.dateTo);

    this.#handleDataChange(
      UserAction.UPDATE_EVENT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
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
