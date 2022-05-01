import SortView from '../view/sort-view';
import EventsListView from '../view/events-list-view';
import EventView from '../view/event-view';
import EditEventView from '../view/edit-event-view';
import {render} from '../render.js';

export default class TripPresenter {
  tripListComponent = new EventsListView();

  init = (container, eventModel = null) => {
    this.eventModel = eventModel;
    this.eventsList = this.eventModel.getEvents().slice();

    render(new SortView(), container);
    render(this.tripListComponent, container);
    render(new EventView(this.eventsList[0]), this.tripListComponent.getElement());
    render(new EditEventView(this.eventsList[3]), this.tripListComponent.getElement());

    for (let i = 1; i < this.eventsList.length; i++) {
      render(new EventView(this.eventsList[i]), this.tripListComponent.getElement());
    }
  };
}
