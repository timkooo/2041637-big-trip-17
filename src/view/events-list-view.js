import AbstractView from '../framework/view/abstract-view';

const createEventsListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class EventsListView extends AbstractView{

  get template() {
    return createEventsListTemplate();
  }

  setOpenEditFormHandler = (cb) => {
    this._callback.openEditFormClick = cb;
    this.element.addEventListener('click', this.#OpenEditFormHandler);
  };

  #OpenEditFormHandler = (evt) => {
    this._callback.openEditFormClick(evt);
  };
}
