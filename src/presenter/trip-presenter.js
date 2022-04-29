import SortView from '../view/sort-view';
import EventsListView from '../view/events-list-view';
import EventView from '../view/event-view';
import NewEventView from '../view/new-event-view';
import {render} from '../render.js';

export default class TripPresenter {
  tripListComponent = new EventsListView();

  init = (container) => {
    render(new SortView(), container);
    render(this.tripListComponent, container);
    render(new EventView(), this.tripListComponent.getElement());
    render(new NewEventView(), this.tripListComponent.getElement());

    for (let i = 0; i < 2; i++) {
      render(new EventView(), this.tripListComponent.getElement());
    }
  };
}
