import SortView from '../view/sort-view';
import EventsListView from '../view/events-list-view';
import {render} from '../framework/render';
import EventsListEmptyView from '../view/events-list-empty-view';
import EventPresenter from './event-presenter';
import {updateItem} from '../utils/common';

export default class TripPresenter {
  #tripContainer = null;
  #eventsModel = null;
  #eventsList = null;
  #eventPresentersList = new Map();
  #eventsListComponent = null;
  #eventsListEmptyComponent = null;

  constructor(tripContainer, eventsModel) {
    this.#tripContainer = tripContainer;
    this.#eventsModel = eventsModel;
    this.#eventsList = this.#eventsModel.events;
  }

  init = () => {
    this.#renderSortComponent();
    this.#renderEventsList();
  };

  #renderEventsList = () => {
    if (this.#eventsList.length !== 0) {
      this.#eventsList = [...this.#eventsModel.events];
      // this.#eventsList = this.#eventsList.filter(filter[FilterTypes.FUTURE]);
      this.#renderEventsListWithData();
    } else {
      this.#renderEventsListEmpty();
    }
  };

  #updateEventDataHandler = (updatedEvent) => {
    this.#eventsList = updateItem(this.#eventsList, updatedEvent);
    this.#eventPresentersList.get(updatedEvent.id).init(updatedEvent);
  };

  #renderEventsListEmpty = () => {
    this.#eventsListEmptyComponent = new EventsListEmptyView();
    render(this.#eventsListEmptyComponent, this.#tripContainer);
  };

  #renderEventsListWithData = () => {
    this.#eventsListComponent = new EventsListView();
    render(this.#eventsListComponent, this.#tripContainer);
    this.#renderEvents();
  };

  #renderSortComponent = () => {
    render(new SortView(), this.#tripContainer);
  };

  #eventListHandler = (evt) => {
    if (evt.target.closest('.event__rollup-btn')) {
      const template = evt.target.closest('.trip-events__item');
      const eventPresenter = this.#eventPresentersList.get(template.dataset.eventId);
      eventPresenter.showEditForm();
    }
  };

  #modeChangeHandler = () => {
    this.#eventPresentersList.forEach((presenter) => presenter.resetView());
  };

  #renderEvents = () => {
    for (let i = 1; i < this.#eventsList.length; i++) {
      this.#renderEvent(this.#eventsList[i]);
    }
    this.#eventsListComponent.setClickHandler(this.#eventListHandler);
  };

  #renderEvent = (event) => {
    const eventPresenter = new EventPresenter(this.#eventsListComponent, this.#modeChangeHandler, this.#updateEventDataHandler);
    this.#eventPresentersList.set(event.id, eventPresenter);
    eventPresenter.init(event);
  };
}
