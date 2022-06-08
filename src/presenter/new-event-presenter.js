import EditEventView from '../view/edit-event-view';
import {remove, render, replace} from '../framework/render';
import {UpdateType, UserAction} from '../utils/const';
import {RenderPosition} from '../framework/render';
import {EditMode} from '../utils/const';

export default class NewEventPresenter {
  #newEventContainer = null;
  #newEventComponent = null;
  #changeDataFunc = null;
  #destroyCallback = null;
  #changeEventTypeFunc = null;
  #eventsModel = null;

  constructor(newEventContainer, changeDataFunc, changeEventTypeFunc, eventsModel) {
    this.#newEventContainer = newEventContainer;
    this.#changeDataFunc = changeDataFunc;
    this.#changeEventTypeFunc = changeEventTypeFunc;
    this.#eventsModel = eventsModel;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    const prevNewEventComponent = this.#newEventComponent;

    this.#newEventComponent = new EditEventView(this.#createDefaultEvent(), EditMode.NEW, this.destinations);

    this.#newEventComponent.setUpdateEventHandler(this.#addNewEventHandler);
    this.#newEventComponent.setCloseEditFormHandler(this.#closeEditFormHandler);
    this.#newEventComponent.setChangeEventTypeHandler(this.#changeEventTypeFunc);
    this.#newEventComponent.setChangeEventDestinationHandler(this.#changeEventDestinationHandler);

    if (prevNewEventComponent === null) {
      render(this.#newEventComponent, this.#newEventContainer.element, RenderPosition.AFTERBEGIN);
      document.addEventListener('keydown', this.#onEscKeyDown2);
      return;
    }

    replace(this.#newEventComponent, prevNewEventComponent);
    remove(prevNewEventComponent);

    document.addEventListener('keydown', this.#onEscKeyDown2);
  };

  #createDefaultEvent = () => ({
    totalPrice: '',
    fromDate: new Date(),
    toDate: new Date(),
    destination: this.#eventsModel.destinations[1],
    isFavorite: false,
    offers: this.#changeEventTypeFunc('bus'),
    type: 'bus',
  });

  setSaving = () => {
    this.#newEventComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#newEventComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#newEventComponent.shake(resetFormState);
  };

  #changeEventDestinationHandler = (eventName) => this.#eventsModel.destinations.find((destination) => destination.name === eventName);

  get destinations() {
    return this.#eventsModel.destinations.map((destination) => destination.name);
  }

  destroy() {
    if (this.#newEventComponent === null) {
      return;
    }
    this.#destroyCallback();

    remove(this.#newEventComponent);
    this.#newEventComponent = null;

    document.removeEventListener('keydown', this.#onEscKeyDown2);
  }

  #addNewEventHandler = (event) => {
    this.#changeDataFunc(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      event,
    );
  };

  #closeEditFormHandler = () => {
    this.destroy();
  };

  #onEscKeyDown2 = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

}
