import {createEvent} from '../mock/event';

export default class EventModel {
  events = Array.from({length: 20}, createEvent);

  getEvents = () => this.events;
}
