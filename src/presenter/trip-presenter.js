import SortView from '../view/sort-view';
import EventsListView from '../view/events-list-view';
import EventView from '../view/event-view';
import NewEventView from '../view/new-event-view';
import {render} from '../render.js';

export default class TripPresenter {
  tripListComponent = new EventsListView();

  getEventOffers = (event) => {
    const offers = [];
    event.offers.forEach((offerId) => {
      const offer = this.offersList[event.type].find((off) => off.id === offerId);
      offers.push(offer);
    });
    return offers;
  };

  init = (container, eventModel = null) => {
    this.eventModel = eventModel;
    this.eventsList = this.eventModel.getEvents().slice();
    this.offersList = this.eventModel.getOffers();

    render(new SortView(), container);
    render(this.tripListComponent, container);
    render(new EventView(this.eventsList[0], this.getEventOffers(this.eventsList[0])), this.tripListComponent.getElement());
    render(new NewEventView(), this.tripListComponent.getElement());

    for (let i = 1; i < this.eventsList.length; i++) {
      const event = this.eventsList[i];
      const offers = this.getEventOffers(event);
      render(new EventView(this.eventsList[i], offers), this.tripListComponent.getElement());
    }
  };
}
