import {humanizeDate} from '../utils/common';
import {getDuration} from '../utils/common';
import {humanizeTime} from '../utils/common';
import AbstractView from '../framework/view/abstract-view';


const createOffersTemplate = (offers) => {
  let offersTemplate = '';
  if (offers) {
    offers.forEach((offer) => {
      if (offer.isSelected) {
        offersTemplate += `<li className="event__offer">
        <span className="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span className="event__offer-price">${offer.price}</span>
         </li>`;
      }
    });
  }
  return offersTemplate;
};

const createEventTemplate = (event) => {
  const {type, destination, totalPrice, fromDate, toDate, isFavorite, offers} = event;

  const date = humanizeDate(fromDate);
  const startTime = humanizeTime(fromDate);
  const endTime = humanizeTime(toDate);
  const duration = getDuration(toDate, fromDate);
  const offerTemplate = createOffersTemplate(offers);

  const classFavorite = isFavorite ? 'event__favorite-btn--active' : '';

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="2019-03-18">${date}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T10:30">${startTime}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T11:00">${endTime}</time>
        </p>
        <p class="event__duration">${duration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${totalPrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offerTemplate}
      </ul>
      <button class="event__favorite-btn ${classFavorite}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class EventView extends AbstractView{
  #event = null;

  constructor(event) {
    super();
    this.#event = event;
  }

  get template() {
    return createEventTemplate(this.#event);
  }

  get event() {
    return this.#event;
  }

  setUpdateEventFavoriteHandler = (cb) => {
    this._callback.updateEventClick = cb;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#updateEventFavoriteHandler);
  };

  #updateEventFavoriteHandler = (evt) => {
    evt.preventDefault();
    this._callback.updateEventClick(this.#event);
  };
}
