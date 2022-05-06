import SortView from '../view/sort-view';
import EventsListView from '../view/events-list-view';
import EventView from '../view/event-view';
import EditEventView from '../view/edit-event-view';
import {createOffersList} from '../mock/event';
import {render} from '../framework/render';
import EventsListEmptyView from '../view/events-list-empty-view';

export default class TripPresenter {
  #container = null;
  #eventModel = null;
  #eventsList = null;
  #eventComponentsList = [];

  #eventsListComponent = new EventsListView();

  constructor() {
    createOffersList();
  }

  #showEditForm = (eventComponent) => {
    const event = eventComponent.event;
    const editEventComponent = new EditEventView(event);

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        this.#eventsListComponent.element.replaceChild(eventComponent.element, editEventComponent.element);
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    const closeEditFormHandler = (evt) => {
      if (evt.target.closest('.event__save-btn') || evt.target.closest('.event__reset-btn')) {
        this.#eventsListComponent.element.replaceChild(eventComponent.element, editEventComponent.element);
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    document.addEventListener('keydown', onEscKeyDown);

    editEventComponent.setCloseEditFormHandler(closeEditFormHandler);

    this.#eventsListComponent.element.replaceChild(editEventComponent.element, eventComponent.element);
  };

  init = (container, eventModel) => {
    this.#container = container;
    if (eventModel.events.length !== 0) {
      this.#eventModel = eventModel;
      this.#eventsList = [...this.#eventModel.events];

      render(new SortView(), this.#container);
      render(this.#eventsListComponent, this.#container);

      this.#renderEvents();
    } else {
      render(new EventsListEmptyView(), this.#container);
    }
  };

  #eventListHandler = (evt) => {
    if (evt.target.closest('.event__rollup-btn')) {
      const template = evt.target.closest('.trip-events__item');
      const currentComponent = this.#eventComponentsList.find((component) => component.element === template);
      this.#showEditForm(currentComponent);
    }
  };

  #renderEvents = () => {
    for (let i = 1; i < this.#eventsList.length; i++) {
      this.#renderEvent(this.#eventsList[i]);
    }

    this.#eventsListComponent.setClickHandler(this.#eventListHandler);
  };

  #renderEvent = (event) => {
    const eventComponent = new EventView(event);
    this.#eventComponentsList.push(eventComponent);

    render(eventComponent, this.#eventsListComponent.element);
  };
}
