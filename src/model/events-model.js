import Observable from '../framework/observable';
import {UpdateType} from '../utils/const';

export default class EventsModel extends Observable {
  #eventsApiService = null;
  #events = null;
  #offers = null;

  constructor(eventsApiService) {
    super();
    this.#eventsApiService = eventsApiService;
  }

  init = async () => {
    try {
      const events = await this.#eventsApiService.events;
      this.#offers = await this.#eventsApiService.offers;
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

  update = async (updateType, update) => {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
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
      throw new Error('Can\'t update task');
    }
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
