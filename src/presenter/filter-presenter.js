import {remove, render, replace} from '../framework/render';
import {UpdateType} from '../utils/const';
import FiltersView from '../view/filters-view';
import {FilterTypes, filter} from '../utils/filter';

export default class FilterPresenter {
  #filterComponent = null;
  #filterContainer = null;
  #eventsModel = null;
  #filterModel = null;

  constructor(filterContainer, eventsModel, filterModel) {
    this.#filterContainer = filterContainer;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;
    this.#filterModel.addObserver(this.#modelEventHandler);
    this.#eventsModel.addObserver(this.#modelEventHandler);
  }

  init = () => {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FiltersView(this.#filterModel.filter, this.#doFiltersActive());

    this.#filterComponent.setChangeFilterEventsHandler(this.#changeFilterEventsHandler);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  destroy = () => {
    remove(this.#filterComponent);
  };

  #changeFilterEventsHandler = (newFilter) => {
    if (newFilter === this.#filterModel.filter) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MINOR, newFilter);
  };

  #modelEventHandler = () => {
    this.init();
  };

  #doFiltersActive = () => ({
    [FilterTypes.EVERYTHING] : Boolean(this.#eventsModel.events.filter(filter[FilterTypes.EVERYTHING]).length),
    [FilterTypes.FUTURE] : Boolean(this.#eventsModel.events.filter(filter[FilterTypes.FUTURE]).length),
    [FilterTypes.PAST] : Boolean(this.#eventsModel.events.filter(filter[FilterTypes.PAST]).length),
  });
}
