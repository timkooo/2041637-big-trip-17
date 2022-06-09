import Observable from '../framework/observable';
import {UpdateType} from '../utils/const';

export default class EventsModel extends Observable {
  #eventsApiService = null;
  #events = null;
  #offers = null;
  #destinations = null;

  constructor(eventsApiService) {
    super();
    this.#eventsApiService = eventsApiService;
  }

  init = async () => {
    try {
      const events = await this.#eventsApiService.events;
      this.#offers = await this.#eventsApiService.offers;
      this.#destinations = await this.#eventsApiService.destinations;
      this.#events = events.map((event) => this.#adaptToClient(event, this.#offers));
    }
    catch(err) {
      this.#events = [];
    }
    this._notify(UpdateType.INIT);
  };

  get offers() {
    return this.#offers;
  }

  get events() {
    return this.#events;
  }

  get destinations() {
    return this.#destinations;
  }

  update = async (updateType, update) => {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting event');
    }
    try {
      const response = await this.#eventsApiService.updateEvent(update);
      const updatedEvent = this.#adaptToClient(response, this.#offers);
      this.#events = [
        ...this.#events.slice(0, index),
        updatedEvent,
        ...this.#events.slice(index + 1),
      ];
      this._notify(updateType, updatedEvent);
    }
    catch (err) {
      throw new Error('Can\'t update event');
    }
  };

  add = async (updateType, update) => {
    try {
      const response = await this.#eventsApiService.addEvent(update);
      const newEvent = this.#adaptToClient(response, this.#offers);
      this.#events = [newEvent, ...this.#events];
      this._notify(updateType, newEvent);
    } catch(err) {
      throw new Error('Can\'t add event');
    }

    this._notify(updateType, update);
  };

  delete = async (updateType, update) => {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }
    try {
      await this.#eventsApiService.deleteEvent(update);
      this.#events = [
        ...this.#events.slice(0, index),
        ...this.#events.slice(index + 1),
      ];
      this._notify(updateType);
    }
    catch(err) {
      throw new Error('Can\'t delete event');
    }
  };

  #adaptClientOffers = (event, offers) => {
    const offersByType = offers.find((offer) => offer.type === event.type);
    return offersByType.offers.map((offer) => ({...offer, isSelected : event.offers.includes(offer.id)}));
  };

  #adaptToClient = (event, offers) => {
    const adaptedEvent = {...event,
      totalPrice: event['base_price'],
      fromDate : event['date_from'],
      toDate : event['date_to'],
      isFavorite : event['is_favorite'],
      offers : this.#adaptClientOffers(event, offers),
    };

    delete adaptedEvent['base_price'];
    delete adaptedEvent['date_from'];
    delete adaptedEvent['date_to'];
    delete adaptedEvent['is_favorite'];

    return adaptedEvent;
  };
}
