import {humanizeEditTime} from '../utils/common';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';

const BLANK_EVENT = {
  totalPrice: '',
  fromDate: '',
  toDate: '',
  destination: '',
  id: '',
  isFavorite: '',
  offers: '',
  type: 'bus',
};

const createPicturesTemplate = (pictures) => {
  const picturesList = pictures.reduce((accumulator, picture) => `${accumulator  }<img class="event__photo" src="${picture.src}" alt="Event photo">`, '');
  return `<div class="event__photos-container">
            <div class="event__photos-tape">
            ${picturesList}
            </div>
          </div>`;
};

const createDescriptionTemplate = (description) => `<p class="event__destination-description">${description}`;

const createDestinationTemplate = (destination) => {
  const descriptionTemplate = destination.description ? createDescriptionTemplate(destination.description) : '';
  const picturesTemplate = destination.pictures ? createPicturesTemplate(destination.pictures) : '';
  return `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            ${descriptionTemplate}
            ${picturesTemplate}
          </section>`;
};

const ifOfferSelected = (offer) => offer.isSelected ? 'checked' : '';

const createOffersTemplate = (offers) => {
  let offerTemplate = '';
  offers.forEach((offer) => {
    offerTemplate += `<div class="event__offer-selector">
                        <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer-luggage" ${ifOfferSelected(offer)}>
                        <label class="event__offer-label" for="${offer.id}">
                          <span class="event__offer-title">${offer.title}</span>
                          &plus;&euro;&nbsp;
                          <span class="event__offer-price">${offer.price}</span>
                        </label>
                      </div>`;
  });
  return `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
             ${offerTemplate}
            </div>
          </section>`;
};

// const createEditEventTemplate = (event) => {
const createEditEventTemplate = (data) => {
  const {type, fromDate, toDate, offers, destination, totalPrice, hasOffers, hasDescription} = data;

  let destinationTemplate = '';
  let offersTemplate = '';

  // const startTime = humanizeEditTime(event.fromDate);
  // const endTime = humanizeEditTime(event.toDate);
  const startTime = humanizeEditTime(fromDate);
  const endTime = humanizeEditTime(toDate);

  if (hasDescription) {
    destinationTemplate = createDestinationTemplate(destination);
  }

  if (hasOffers) {
    offersTemplate = createOffersTemplate(offers);
  }

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>

            <div class="event__type-item">
              <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
              <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
              <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
              <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
              <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
              <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
              <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
              <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
              <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
              <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
            </div>
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
        <datalist id="destination-list-1">
          <option value="Amsterdam"></option>
          <option value="Geneva"></option>
          <option value="Chamonix"></option>
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${totalPrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
    <section class="event__details">

      ${offersTemplate}
      ${destinationTemplate}

    </section>
  </form>
</li>`;
};

export default class EditEventView extends AbstractStatefulView{

  constructor(event = BLANK_EVENT) {
    super();
    this._state = this.#convertEventToStatement(event);

    this.#setInnerHandlers();
  }

  get template() {
    return createEditEventTemplate(this._state);
  }

  #convertEventToStatement = (event) => {
    const statement = JSON.parse(JSON.stringify(event));
    return {...statement,
      hasDescription : Boolean(event.destination.description || event.destination.pictures),
      hasOffers : Boolean(event.offers.length),
    };
  };

  #convertStatementToEvent = () => {
    const event = {...this._state};
    delete event.hasDescription;
    delete event.hasOffers;
    return event;
  };

  reset = (event) => this.updateElement(this.#convertEventToStatement(event));

  setCloseEditFormHandler = (cb) => {
    this._callback.closeEditFormClick = cb;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#closeEditFormHandler);
  };

  setUpdateEventHandler = (cb) => {
    this._callback.updateEventClick = cb;
    this.element.querySelector('form').addEventListener('submit', this.#updateEventHadler);
  };

  #closeEditFormHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeEditFormClick();
  };

  #updateEventHadler = (evt) => {
    evt.preventDefault();
    this._callback.updateEventClick(this.#convertStatementToEvent());
  };

  #editPriceHandler = (evt) => {
    evt.preventDefault();
    this._setState({totalPrice : evt.target.value});
  };

  #editDestinationHandler = (evt) => {
    evt.preventDefault();
    this._setState({destination : {name : evt.target.value}});
  };

  #editOffersHandler = (evt) => {
    evt.preventDefault();
    const offerId = evt.target.id;
    const targetOffer = this._state.offers.find((offer) => offer.id === +offerId);
    targetOffer.isSelected = evt.target.checked;
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__input--price').addEventListener('input', this.#editPriceHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#editDestinationHandler);
    if (this._state.hasOffers) {
      this.element.querySelector('.event__available-offers').addEventListener('change', this.#editOffersHandler);
    }
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setUpdateEventHandler(this._callback.updateEventClick);
    this.setCloseEditFormHandler(this._callback.closeEditFormClick);
  };
}
