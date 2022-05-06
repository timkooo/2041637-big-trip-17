import AbstractView from '../framework/view/abstract-view';

const createEventsListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class EventsListView extends AbstractView{

  get template() {
    return createEventsListTemplate();
  }

  setClickHandler = (callBack) => {
    this._callback.click = callBack;
    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click(evt);
  };

}
