import SortView from '../view/sort-view';
import EventsListView from '../view/events-list-view';
import EventView from '../view/event-view';
import EditEventView from '../view/edit-event-view';
import {createOffersList} from '../mock/event';
import {render} from '../render.js';

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

    editEventComponent.element.addEventListener('click', (evt) => {
      if (evt.target.closest('.event__save-btn') || evt.target.closest('.event__reset-btn')) {
        this.#eventsListComponent.element.replaceChild(eventComponent.element, editEventComponent.element);
      }
    });

    this.#eventsListComponent.element.replaceChild(editEventComponent.element, eventComponent.element);
  };

  init = (container, eventModel) => {
    this.#container = container;
    this.#eventModel = eventModel;
    //this.#eventsList = this.eventModel.events.slice();
    this.#eventsList = [...this.#eventModel.events];

    render(new SortView(), this.#container);
    render(this.#eventsListComponent, this.#container);
    render(new EventView(this.#eventsList[0]), this.#eventsListComponent.element);
    render(new EditEventView(this.#eventsList[3]), this.#eventsListComponent.element);

    this.#renderEvents();
  };

  #renderEvents = () => {
    for (let i = 1; i < this.#eventsList.length; i++) {
      this.#renderEvent(this.#eventsList[i]);
    }

    this.#eventsListComponent.element.addEventListener('click', (evt) => {
      if (evt.target.closest('.event__rollup-btn')) {
        const template = evt.target.closest('.trip-events__item');
        const currentComponent = this.#eventComponentsList.find((component) => component.element === template);
        this.#showEditForm(currentComponent);
      }
    });
  };

  #renderEvent = (event) => {
    const eventComponent = new EventView(event);
    this.#eventComponentsList.push(eventComponent);

    render(eventComponent, this.#eventsListComponent.element);
  };
}
