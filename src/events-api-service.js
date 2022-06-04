import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
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

  updateEvent = async (event) => {
    const response = await this._load({
      url: `points/${event.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  };

  #adaptServerOffers = (offers) => {
    const adaptOffers = [];
    offers.forEach((offer) => adaptOffers.push(offer.id));
    return adaptOffers;
  };

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
    console.log(adaptedEvent);
    return adaptedEvent;
  };
}
