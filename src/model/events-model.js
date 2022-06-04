import {createEvent, getOffersList} from '../mock/event';
import {createOffersList} from '../mock/event';
import Observable from '../framework/observable';

export default class EventsModel extends Observable {
  #events = null;
  #offers = null;

  constructor() {
    super();
    createOffersList();
    this.#offers = getOffersList();
    this.#events = Array.from({length: 20}, createEvent);
  }

  get offers() {
    return this.#offers;
  }

  get events() {
    return this.#events;
  }

  update = (updateType, update) => {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.#events = [
      ...this.#events.slice(0, index),
      update,
      ...this.#events.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

  add = (updateType, update) => {
    this.#events = [
      update,
      ...this.#events,
    ];

    this._notify(updateType, update);
  };

  delete = (updateType, update) => {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#events = [
      ...this.#events.slice(0, index),
      ...this.#events.slice(index + 1),
    ];

    this._notify(updateType);
  };
}
