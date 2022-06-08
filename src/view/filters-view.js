import AbstractView from '../framework/view/abstract-view';
import {FilterTypes} from '../utils/filter';

const createFiltersTemplate = (currenFilter, filtersActivity) => (
  `<form class="trip-filters" action="#" method="get">
    <div class="trip-filters__filter">
      <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${currenFilter === FilterTypes.EVERYTHING ? 'checked' : ''} ${filtersActivity['everything'] ? '' : 'disabled'}>
      <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
    </div>

    <div class="trip-filters__filter">
      <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future" ${currenFilter === FilterTypes.FUTURE ? 'checked' : ''} ${filtersActivity['future'] ? '' : 'disabled'}>
      <label class="trip-filters__filter-label" for="filter-future">Future</label>
    </div>

    <div class="trip-filters__filter">
      <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past" ${currenFilter === FilterTypes.PAST ? 'checked' : ''} ${filtersActivity['past'] ? '' : 'disabled'}>
      <label class="trip-filters__filter-label" for="filter-past">Past</label>
    </div>

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class FiltersView extends AbstractView{

  #currentFilter = null;
  #filtersActivity = null;

  constructor(currentFilter, filtersActivity) {
    super();
    this.#currentFilter = currentFilter;
    this.#filtersActivity = filtersActivity;
  }

  get template() {
    return createFiltersTemplate(this.#currentFilter, this.#filtersActivity);
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
