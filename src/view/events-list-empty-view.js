import AbstractView from '../framework/view/abstract-view';
import {FilterTypes} from '../utils/filter';

const filterToMessage = {
  [FilterTypes.EVERYTHING] : 'Click New Event to create your first point',
  [FilterTypes.PAST] : 'There are no past events now',
  [FilterTypes.FUTURE] : 'There are no future events now',
};

const createEventsListEmptyTemplate = (filter) => `<p class="trip-events__msg">${filterToMessage[filter]}</p>`;

export default class EventsListEmptyView extends AbstractView{

  #currentFilter = null;

  constructor(currentFilter) {
    super();
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createEventsListEmptyTemplate(this.#currentFilter);
  }

}
