import {createEvent} from '../mock/event';
// import {createOffersList} from '../mock/event';

export default class EventModel {
  events = Array.from({length: 20}, createEvent);
  // offers = createOffersList();

  getEvents = () => this.events;
  // getOffers = () => this.offers;
}
