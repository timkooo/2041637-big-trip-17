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
    this.#newEventPresenter = new NewEventPresenter(this.#eventsListComponent, this.#eventsChangeHandler);
    this.#eventsModel.addObserver(this.#modelEventHadler);
    this.#filterModel.addObserver(this.#modelEventHadler);
  }

  get events() {
    this.#currentFilter = this.#filterModel.filter;
    const events = this.#eventsModel.events.filter(filter[this.#currentFilter]);
    return events.sort(sorting[this.#currentSorting]);
  }

  init = () => {
    this.#renderSortComponent();
    this.#renderEventsList();
  };

  addNewEvent = (callback) => {
    this.#currentSorting = SortingTypes.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterTypes.EVERYTHING);
    this.#newEventPresenter.init(callback);
  };

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

  #clearEventsList = () => {
    if (this.#eventsListEmptyComponent !== null) {
      remove(this.#eventsListEmptyComponent);
    }
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
    this.#renderEvents();
  };

  #eventsChangeHandler = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this.#eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this.#eventsModel.deleteEvent(updateType, update);
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
      case UpdateType.MAJOR:
        // this.#clearBoard({resetRenderedTaskCount: true, resetSortType: true});
        // this.#renderBoard();
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
    const eventPresenter = new EventPresenter(this.#eventsListComponent, this.#viewModeChangeHandler, this.#eventsChangeHandler);
    this.#eventPresentersList.set(event.id, eventPresenter);
    eventPresenter.init(event);
  };
}
