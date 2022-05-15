import {createEvent} from '../mock/event';
import {createOffersList} from '../mock/event';

export default class EventsModel {
  #events = null;

  constructor() {
    createOffersList();
    this.#events = Array.from({length: 20}, createEvent);
  }

  get events() {
    return this.#events;
  }
}
