import EventView from '../view/event-view';
import {remove, render, replace} from '../framework/render';
import EditEventView from '../view/edit-event-view';

const EventMode = {
  DEFAULT : 'default',
  EDITING : 'editing',
};

export default class EventPresenter {
  #event = null;
  #eventComponent = null;
  #editEventComponent = null;
  #eventsListComponent = null;
  #eventMode = EventMode.DEFAULT;

  #modeChangeFunc = null;
  #dataUpdateFunc = null;

  constructor(eventListComponent, modeChangeFunc, dataUpdateFunc) {
    this.#eventsListComponent = eventListComponent;
    this.#modeChangeFunc = modeChangeFunc;
    this.#dataUpdateFunc = dataUpdateFunc;
  }

  init(event) {
    this.#event = event;

    const prevEventComponent = this.#eventComponent;
    const prevEditEventComponent = this.#editEventComponent;

    this.#eventComponent = new EventView(this.#event);
    this.#editEventComponent = new EditEventView(this.#event);

    this.#eventComponent.setUpdateEventFavoriteHandler(this.#updateEventFavoriteHandler);
    this.#editEventComponent.setCloseEditFormHandler(this.#closeEditFormHandler);
    this.#editEventComponent.setUpdateEventHandler(this.#updateEventDataHandler);

    this.#eventComponent.element.dataset.eventId = this.#event.id;
    this.#editEventComponent.element.dataset.eventId = this.#event.id;

    if (prevEventComponent === null || prevEditEventComponent === null) {
      render(this.#eventComponent, this.#eventsListComponent.element);
      return;
    }

    if (this.#eventMode === EventMode.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#eventMode === EventMode.EDITING) {
      replace(this.#editEventComponent, prevEditEventComponent);
    }

    remove(prevEventComponent);
    remove(prevEditEventComponent);
  }

  destroy = () => {
    remove(this.#eventComponent);
    remove(this.#editEventComponent);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#editEventComponent.reset(this.#event);
      this.#closeEditFormHandler();
    }
  };

  showEditForm = () => {
    replace(this.#editEventComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#modeChangeFunc();
    this.#eventMode = EventMode.EDITING;
  };

  #closeEditFormHandler = () => {
    this.#editEventComponent.reset(this.#event);
    replace(this.#eventComponent, this.#editEventComponent);
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#eventMode = EventMode.DEFAULT;
  };

  resetView = () => {
    if (this.#eventMode !== EventMode.DEFAULT) {
      this.#editEventComponent.reset(this.#event);
      this.#closeEditFormHandler();
    }
  };

  #updateEventFavoriteHandler = (event) => {
    this.#dataUpdateFunc({...event, isFavorite : !event.isFavorite});
  };

  #updateEventDataHandler = (event) => {
    this.#dataUpdateFunc(event);
    this.#closeEditFormHandler();
  };
}
