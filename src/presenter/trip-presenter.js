import SortView from '../view/sort-view';
import EventsListView from '../view/events-list-view';
import {render} from '../framework/render';
import EventsListEmptyView from '../view/events-list-empty-view';
import EventPresenter from './event-presenter';
import {updateItem} from '../utils/common';
import {filter, FilterTypes, sorting, SortingTypes} from '../utils/filter';

export default class TripPresenter {
  #tripContainer = null;
  #eventsModel = null;
  #eventsList = null;
  #eventsListInitial = null;
  #eventPresentersList = new Map();
  #eventsListComponent = null;
  #eventsListEmptyComponent = null;
  #filterComponent = null;
  #currentFilter = FilterTypes.EVERYTHING;
  #currentSorting = SortingTypes.DAY;

  constructor(tripContainer, eventsModel, filterComponent) {
    this.#tripContainer = tripContainer;
    this.#eventsModel = eventsModel;
    this.#eventsList = [...this.#eventsModel.events];
    this.#eventsListInitial = [...this.#eventsModel.events];
    this.#filterComponent = filterComponent;
  }

  init = () => {
    this.#renderSortComponent();
    this.#renderEventsList();
    this.#filterComponent.setFilterEventsHandler(this.#filterEventsHandler);
  };

  #sortEventsHandler = (newSorting) => {
    if (newSorting !== this.#currentSorting) {
      this.#currentSorting = newSorting;
      this.#reRenderEventsList();
    }
  };

  #filterEventsHandler = (newFilter) => {
    switch (newFilter) {
      case this.#currentFilter:
        break;
      case FilterTypes.EVERYTHING:
        this.#eventsList = this.#eventsListInitial;
        this.#currentFilter = FilterTypes.EVERYTHING;
        this.#currentSorting = SortingTypes.DAY;
        this.#reRenderEventsList();
        // this.#sortEventsHandler(SortingTypes.DAY);
        break;
      default:
        this.#eventsList = this.#eventsListInitial.filter(filter[newFilter]);
        this.#currentFilter = newFilter;
        this.#currentSorting = SortingTypes.DAY;
        this.#reRenderEventsList();
        // this.#sortEventsHandler(SortingTypes.DAY);
        break;
    }
  };

  #reRenderEventsList = () => {
    this.#clearEventsList();
    this.#renderEventsList();
  };

  #clearEventsList = () => {
    this.#eventPresentersList.forEach((presenter) => presenter.destroy());
    this.#eventPresentersList.clear();
  };

  #renderEventsList = () => {
    this.#eventsList.sort(sorting[this.#currentSorting]);
    if (this.#eventsList.length === 0) {
      this.#renderEventsListEmpty();
      return;
    }
    this.#renderEventsListWithData();
  };

  #updateEventDataHandler = (updatedEvent) => {
    this.#eventsList = updateItem(this.#eventsList, updatedEvent);
    this.#eventsListInitial = updateItem(this.#eventsListInitial, updatedEvent);
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
    const sortView = new SortView();
    sortView.setSortEventsHandler(this.#sortEventsHandler);
    render(sortView, this.#tripContainer);
  };

  #openEditFormHandler = (evt) => {
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
    this.#eventsList.forEach((event) => this.#renderEvent(event));
    this.#eventsListComponent.setOpenEditFormHandler(this.#openEditFormHandler);
  };

  #renderEvent = (event) => {
    const eventPresenter = new EventPresenter(this.#eventsListComponent, this.#modeChangeHandler, this.#updateEventDataHandler);
    this.#eventPresentersList.set(event.id, eventPresenter);
    eventPresenter.init(event);
  };
}
