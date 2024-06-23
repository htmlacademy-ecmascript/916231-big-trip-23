import {remove, render, RenderPosition} from '../framework/render.js';
import EventEdit from '../view/event-edit.js';
import {UserAction, UpdateType} from '../const.js';
import {isEscapeKey} from '../utils.js';

export default class NewEventPresenter {
  #eventListContainer = null;
  #event = null;
  #destinationsModel = null;
  #offersModel = null;
  #onSubmitClick = null;
  #onDestroy = null;

  #eventEditComponent = null;

  constructor({eventListContainer, event, destinationsModel, offersModel, onSubmitClick, onDestroy}) {
    this.#eventListContainer = eventListContainer;
    this.#event = event;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#onSubmitClick = onSubmitClick;
    this.#onDestroy = onDestroy;
  }

  init() {
    if (this.#eventEditComponent !== null) {
      return;
    }

    this.#eventEditComponent = new EventEdit({
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onSubmitClick: this.#handleFormSubmit,
      onCancelClick: this.#handleDeleteClick,
      onDeleteClick: this.#handleDeleteClick,
      isNewEvent: true,
    });

    render(this.#eventEditComponent, this.#eventListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#documentKeydownHandler);
  }

  destroy() {
    if (this.#eventEditComponent === null) {
      return;
    }

    this.#onDestroy();

    remove(this.#eventEditComponent);
    this.#eventEditComponent = null;

    document.removeEventListener('keydown', this.#documentKeydownHandler);
  }

  setSaving() {
    this.#eventEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#eventEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#eventEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (event) => {
    this.#onSubmitClick(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      event,
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #documentKeydownHandler = (evt) => {
    if(isEscapeKey(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}
