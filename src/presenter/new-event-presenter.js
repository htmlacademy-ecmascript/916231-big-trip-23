import {remove, render, RenderPosition} from '../framework/render.js';
import EventEdit from '../view/event-edit.js';
import {UserAction, UpdateType} from '../const.js';

export default class NewEventPresenter {
  #eventListContainer = null;
  #event = null;
  #destinationList = null;
  #offersList = null;
  #onSubmitClick = null;
  #onDestroy = null;

  #eventEditComponent = null;

  constructor({eventListContainer, event, destinationList, offersList, onSubmitClick, onDestroy}) {
    this.#eventListContainer = eventListContainer;
    this.#event = event;
    this.#destinationList = destinationList;
    this.#offersList = offersList;
    this.#onSubmitClick = onSubmitClick;
    this.#onDestroy = onDestroy;
  }

  init() {
    if (this.#eventEditComponent !== null) {
      return;
    }

    this.#eventEditComponent = new EventEdit({
      destinationList: this.#destinationList,
      offersList: this.#offersList,
      onSubmitClick: this.#handleFormSubmit,
      onCancelClick: this.#handleDeleteClick,
      onDeleteClick: this.#handleDeleteClick,
      isNewEvent: true,
    });

    render(this.#eventEditComponent, this.#eventListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#eventEditComponent === null) {
      return;
    }

    this.#onDestroy();

    remove(this.#eventEditComponent);
    this.#eventEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
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

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
