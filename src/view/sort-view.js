import AbstractView from '../framework/view/abstract-view';
import {SortingTypes} from '../utils/sorting';

const createSortTemplate = (currentSorting) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <div class="trip-sort__item  trip-sort__item--day">
      <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" ${currentSorting === SortingTypes.DAY ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-day">Day</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--event">
      <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
      <label class="trip-sort__btn" for="sort-event">Event</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--time">
      <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time" ${currentSorting === SortingTypes.TIME ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-time">Time</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--price">
      <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" ${currentSorting === SortingTypes.PRICE ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-price">Price</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--offer">
      <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
      <label class="trip-sort__btn" for="sort-offer">Offers</label>
    </div>
  </form>`
);

export default class SortView extends AbstractView{

  #currentSorting = null;

  constructor(currentSorting) {
    super();
    this.#currentSorting = currentSorting;
  }

  get template() {
    return createSortTemplate(this.#currentSorting);
  }

  setChangeSortEventsHandler = (cb) => {
    this._callback.chageSortEventsClick = cb;
    this.element.addEventListener('click', this.#changeSortEventsHandler);
  };

  #changeSortEventsHandler = (evt) => {
    if (evt.target.closest('.trip-sort__input')) {
      this._callback.chageSortEventsClick(evt.target.value);
    }
  };
}
