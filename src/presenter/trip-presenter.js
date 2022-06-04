import SortView from '../view/sort-view';
import EventsListView from '../view/events-list-view';
import {remove, render, RenderPosition} from '../framework/render';
import EventsListEmptyView from '../view/events-list-empty-view';
import EventPresenter from './event-presenter';
import {UserAction, UpdateType} from '../utils/const';
import {filter, FilterTypes} from '../utils/filter';
import {sorting, SortingTypes} from '../utils/sorting';
import NewEventPresenter from './new-event-presenter';

export default class TripPresenter {
  #tripContainer = null;
  #eventsModel = null;
  #filterModel = null;
  #eventPresentersList = new Map();
  #eventsListComponent = null;
  #eventsListEmptyComponent = null;
  #sortingComponent = null;
  #currentFilter = null;
  #currentSorting = SortingTypes.DAY;
  #newEventPresenter = null;

  constructor(tripContainer, eventsModel, filterModel) {
    this.#tripContainer = tripContainer;
    this.#eventsListComponent = new EventsListView();
    render(this.#eventsListComponent, this.#tripContainer);
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;
    this.#newEventPresenter = new NewEventPresenter(this.#eventsListComponent, this.#eventsChangeHandler, this.#getOffersByType);
    this.#eventsModel.addObserver(this.#modelEventHadler);
    this.#filterModel.addObserver(this.#resetSortingHandler);
  }

  get events() {
    this.#currentFilter = this.#filterModel.filter;
    const events = this.#eventsModel.events.filter(filter[this.#currentFilter]);
    return events.sort(sorting[this.#currentSorting]);
  }

  init = () => {
    this.#renderEventsList();
  };

  addNewEvent = (callback) => {
    this.#currentSorting = SortingTypes.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterTypes.EVERYTHING);
    this.#newEventPresenter.init(callback);
  };

  #getOffersByType = (eventType) => this.#eventsModel.offers.find((offersByType) => offersByType.type === eventType).offers;

  #changeSortEventsHandler = (newSorting) => {
    if (newSorting !== this.#currentSorting) {
      this.#currentSorting = newSorting;
      this.#reRenderEventsList();
    }
  };

  #reRenderEventsList = () => {
    this.#clearEventsList();
    this.#renderEventsList();
  };

  #resetSortingHandler = () => {
    this.#currentSorting = SortingTypes.DAY;
    this.#reRenderEventsList();
  };

  #clearEventsList = () => {
    if (this.#eventsListEmptyComponent !== null) {
      remove(this.#eventsListEmptyComponent);
    }
    remove(this.#sortingComponent);
    this.#newEventPresenter.destroy();
    this.#eventPresentersList.forEach((presenter) => presenter.destroy());
    this.#eventPresentersList.clear();
  };

  #renderEventsList = () => {
    if (this.events.length === 0) {
      this.#eventsListEmptyComponent = new EventsListEmptyView(this.#currentFilter);
      render(this.#eventsListEmptyComponent, this.#tripContainer, RenderPosition.BEFOREEND);
      return;
    }
    this.#renderSortComponent();
    this.#renderEvents();
  };

  #eventsChangeHandler = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventsModel.update(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this.#eventsModel.add(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this.#eventsModel.delete(updateType, update);
        break;
    }
  };

  #modelEventHadler = (updateType, updatedEvent) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventPresentersList.get(updatedEvent.id).init(updatedEvent);
        break;
      case UpdateType.MINOR:
        this.#reRenderEventsList();
        break;
    }
  };

  #renderSortComponent = () => {
    this.#sortingComponent = new SortView(this.#currentSorting);
    this.#sortingComponent.setChangeSortEventsHandler(this.#changeSortEventsHandler);
    render(this.#sortingComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #openEditFormHandler = (evt) => {
    if (evt.target.closest('.event__rollup-btn')) {
      const template = evt.target.closest('.trip-events__item');
      const eventPresenter = this.#eventPresentersList.get(template.dataset.eventId);
      eventPresenter.showEditForm();
    }
  };

  #viewModeChangeHandler = () => {
    this.#newEventPresenter.destroy();
    this.#eventPresentersList.forEach((presenter) => presenter.resetView());
  };

  #renderEvents = () => {
    this.events.forEach((event) => this.#renderEvent(event));
    this.#eventsListComponent.setOpenEditFormHandler(this.#openEditFormHandler);
  };

  #renderEvent = (event) => {
    const eventPresenter = new EventPresenter(this.#eventsListComponent, this.#viewModeChangeHandler, this.#eventsChangeHandler, this.#getOffersByType);
    this.#eventPresentersList.set(event.id, eventPresenter);
    eventPresenter.init(event);
  };
}
