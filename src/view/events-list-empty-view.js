import {createElement} from '../render.js';

const createEventsListEmptyTemplate = () => '<p class="trip-events__msg">Click New Event to create your first point</p>';

export default class EventsListEmptyView {
  #element = null;

  get template() {
    return createEventsListEmptyTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
