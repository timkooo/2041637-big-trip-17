import SortListView from '../view/sort-list-view';
import TripEventsListView from '../view/trip-events-list-view';
import TripEventItemView from '../view/trip-event-item-view';
import AddEventItemView from '../view/add-event-item-view';
import {render} from '../render.js';

export default class Presenter {
  tripListComponent = new TripEventsListView();

  init = (boardContainer) => {
    this.boardContainer = boardContainer;

    render(new SortListView(), this.boardContainer);
    render(this.tripListComponent, this.boardContainer);
    render(new AddEventItemView(), this.tripListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new TripEventItemView(), this.tripListComponent.getElement());
    }
  };
}
