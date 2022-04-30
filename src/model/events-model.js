import {createNewEvent} from '../dummy/event-dummy';
import {getOffers} from '../dummy/offer-dummy';

export default class EventsModel {
  events = Array.from({length: 20}, createNewEvent);
  offers = getOffers();

  getEvents = () => this.events;
  getOffers = () => this.offers;
}
