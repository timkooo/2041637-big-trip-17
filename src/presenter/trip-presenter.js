import SortView from '../view/sort-view';
import EventsListView from '../view/events-list-view';
import {remove, render} from '../framework/render';
import EventsListEmptyView from '../view/events-list-empty-view';
import EventPresenter from './event-presenter';
import {updateItem} from '../utils/common';
import {filter, FilterTypes} from '../utils/filter';
import {sorting, SortingTypes} from '../utils/sorting';
import FiltersView from '../view/filters-view';

export default class TripPresenter {
  #tripContainer = null;
  #filterContainer = null;
  #eventsModel = null;
  #eventsList = null;
  #eventsListInitial = null;
  #eventPresentersList = new Map();
  #eventsListComponent = null;
  #eventsListEmptyComponent = null;
  #sortingComponent = null;
  #filterComponent = null;
  #currentFilter = FilterTypes.EVERYTHING;
  #currentSorting = SortingTypes.DAY;

  constructor(tripContainer, eventsModel, filterContainer) {
    this.#tripContainer = tripContainer;
    this.#eventsModel = eventsModel;
    this.#eventsList = [...this.#eventsModel.events];
    this.#eventsListInitial = [...this.#eventsModel.events];
    this.#filterContainer = filterContainer;
  }

  init = () => {
    this.#renderFilterComponent();
    this.#renderSortComponent();
    this.#renderEventsList();
    this.#filterComponent.setFilterEventsHandler(this.#filterEventsHandler);
  };

  #renderFilterComponent = () => {
    this.#filterComponent = new FiltersView();
    render(this.#filterComponent, this.#filterContainer);
  };

  #sortEventsHandler = (newSorting) => {
    if (newSorting !== this.#currentSorting) {
      this.#currentSorting = newSorting;
      this.#reRenderEventsList();
    }
  };

  #filterEventsHandler = (newFilter) => {
    if (newFilter === this.#currentFilter) {
      return;
    }
    this.#eventsList = this.#eventsListInitial.filter(filter[newFilter]);
    this.#currentFilter = newFilter;
    this.#currentSorting = SortingTypes.DAY;
    remove(this.#sortingComponent);
    this.#renderSortComponent();
    this.#reRenderEventsList();
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
    this.#sortingComponent = new SortView();
    this.#sortingComponent.setSortEventsHandler(this.#sortEventsHandler);
    render(this.#sortingComponent, this.#tripContainer);
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
