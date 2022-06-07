import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class EventsApiService extends ApiService {
  get events() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  updateEvent = async (event) => {
    const response = await this._load({
      url: `points/${event.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  };

  addEvent = async (event) => {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  };

  deleteEvent = async (event) => await this._load({
    url: `points/${event.id}`,
    method: Method.DELETE,
  });

  #adaptServerOffers = (offers) => offers
    .filter((offer) => offer.isSelected)
    .map((offer) => offer.id);

  #adaptToServer = (event) => {
    const adaptedEvent = {
      ...event,
      'base_price' : event.totalPrice,
      'date_from' : event.fromDate,
      'date_to' : event.toDate,
      'is_favorite' : event.isFavorite,
      offers: this.#adaptServerOffers(event.offers),
    };

    delete adaptedEvent.totalPrice;
    delete adaptedEvent.fromDate;
    delete adaptedEvent.toDate;
    delete adaptedEvent.isFavorite;
    return adaptedEvent;
  };
}
