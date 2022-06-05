import EventView from '../view/event-view';
import {remove, render, replace} from '../framework/render';
import EditEventView from '../view/edit-event-view';
import {UserAction, UpdateType} from '../utils/const';
import {EditMode} from '../utils/const';

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

  #viewModeChangeFunc = null;
  #eventsChangeFunc = null;
  #changeEventTypeFunc = null;

  constructor(eventListComponent, modeChangeFunc, eventsChangeFunc, changeOfferTypeFunc) {
    this.#eventsListComponent = eventListComponent;
    this.#viewModeChangeFunc = modeChangeFunc;
    this.#eventsChangeFunc = eventsChangeFunc;
    this.#changeEventTypeFunc = changeOfferTypeFunc;
  }

  init(event) {
    this.#event = event;

    const prevEventComponent = this.#eventComponent;
    const prevEditEventComponent = this.#editEventComponent;

    this.#eventComponent = new EventView(this.#event);
    this.#editEventComponent = new EditEventView(this.#event, EditMode.EDIT);

    this.#eventComponent.setUpdateEventFavoriteHandler(this.#updateEventFavoriteHandler);
    this.#editEventComponent.setCloseEditFormHandler(this.#closeEditFormHandler);
    this.#editEventComponent.setUpdateEventHandler(this.#updateEventHandler);
    this.#editEventComponent.setDeleteEventHandler(this.#deleteEventHandler);
    this.#editEventComponent.setChangeEventTypeHandler(this.#changeEventTypeFunc);

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
      this.#editEventComponent.reset(this.#event);
      this.#closeEditFormHandler();
    }
  };

  showEditForm = () => {
    replace(this.#editEventComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#viewModeChangeFunc();
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
      this.#closeEditFormHandler();
    }
  };

  #updateEventFavoriteHandler = (event) => {
    this.#eventsChangeFunc(
      UserAction.UPDATE_EVENT,
      UpdateType.PATCH,
      {...event, isFavorite : !event.isFavorite});
  };

  #areOffersChanged = (event) => this.#event.offers.some((offer, index) => offer.isSelected !== event.offers[index].isSelected);

  #updateEventHandler = (event) => {
    const isMinorUpdate = (this.#event.fromDate !== event.fromDate) || this.#areOffersChanged(event) ||
      (this.#event.toDate !== event.toDate) || (this.#event.totalPrice !== event.totalPrice);
    this.#eventsChangeFunc(
      UserAction.UPDATE_EVENT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      event);
    // this.#eventsChangeFunc(
    //   UserAction.UPDATE_EVENT,
    //   updateType,
    //   event);
    this.#closeEditFormHandler();
  };

  #deleteEventHandler = (event) => {
    this.#eventsChangeFunc(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      event);
  };
}
