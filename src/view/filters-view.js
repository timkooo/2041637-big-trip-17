import AbstractView from '../framework/view/abstract-view';
import {FilterTypes} from '../utils/filter';

const createFiltersTemplate = (currenFilter) => (
  `<form class="trip-filters" action="#" method="get">
    <div class="trip-filters__filter">
      <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${currenFilter === FilterTypes.EVERYTHING ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
    </div>

    <div class="trip-filters__filter">
      <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future" ${currenFilter === FilterTypes.FUTURE ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-future">Future</label>
    </div>

    <div class="trip-filters__filter">
      <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past" ${currenFilter === FilterTypes.PAST ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-past">Past</label>
    </div>

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class FiltersView extends AbstractView{

  #currentFilter = null;

  constructor(currentFilter) {
    super();
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createFiltersTemplate(this.#currentFilter);
  }

  setChangeFilterEventsHandler = (cb) => {
    this._callback.changeFilterEventsClick = cb;
    this.element.addEventListener('click', this.#changeFilterEventsHandler);
  };

  #changeFilterEventsHandler = (evt) => {
    if (evt.target.closest('.trip-filters__filter-input')) {
      this._callback.changeFilterEventsClick(evt.target.value);
    }
  };
}
