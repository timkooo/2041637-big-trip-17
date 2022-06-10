import {humanizeEditTime} from '../utils/common';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';
import {EditMode} from '../utils/const';
import 'flatpickr/dist/flatpickr.min.css';

const EventType = {
  TAXI: 'taxi',
  RESTAURANT: 'restaurant',
  BUS: 'bus',
  TRAIN: 'train',
  DRIVE: 'drive',
  CHECKIN: 'check-in',
  SIGHTSEEING: 'sightseeing',
  SHIP: 'ship',
  FLIGHT: 'flight',
};

const createEditModeTemplate = (editMode, isDeleting) => {
  if (editMode === EditMode.EDIT) {
    return `<button class="event__reset-btn" type="reset">${isDeleting ? 'Deleting...' : 'Delete'}</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>`;
  }
  if (editMode === EditMode.NEW) {
    return '<button class="event__reset-btn" type="reset">Cancel</button>';
  }
};

const createPicturesTemplate = (pictures) => {
  const picturesList = pictures.reduce((accumulator, picture) => `${accumulator}<img class="event__photo" src="${picture.src}" alt="Event photo">`, '');
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

const createDestinationList = (destinations) => destinations.reduce((accumulator, destination) => `${accumulator}<option value="${destination}"></option>`, '');

const createOffersTemplate = (offers, isDisabled) => {
  const offerTemplate = offers.reduce((accumulator, offer) =>
    `${accumulator}<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer-luggage" ${ifOfferSelected(offer)} ${isDisabled ? 'disabled' : ''}>
      <label class="event__offer-label" for="${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`, '');
  return `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
             ${offerTemplate}
            </div>
          </section>`;
};

const createEditEventTemplate = (event, editMode, destinations) => {
  const {type, fromDate, toDate, offers, destination, totalPrice, isDisabled, isSaving, isDeleting} = event;

  let destinationTemplate = '';
  let offersTemplate = '';

  const startTime = humanizeEditTime(fromDate);
  const endTime = humanizeEditTime(toDate);
  const destinationList = createDestinationList(destinations);
  const editModeTemplate = createEditModeTemplate(editMode, isDeleting);

  if (destinations.includes(destination.name) && (destination.description || destination.pictures)) {
    destinationTemplate = createDestinationTemplate(destination);
  }

  if (event.offers.length !== 0) {
    offersTemplate = createOffersTemplate(offers, isDisabled);
  }

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>

            <div class="event__type-item">
              <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi" ${type === EventType.TAXI ? 'checked' : ''}>
              <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus" ${type === EventType.BUS ? 'checked' : ''}>
              <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train" ${type === EventType.TRAIN ? 'checked' : ''}>
              <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship" ${type === EventType.SHIP ? 'checked' : ''}>
              <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive" ${type === EventType.DRIVE ? 'checked' : ''}>
              <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" ${type === EventType.FLIGHT ? 'checked' : ''}>
              <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in" ${type === EventType.CHECKIN ? 'checked' : ''}>
              <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing" ${type === EventType.SIGHTSEEING ? 'checked' : ''}>
              <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant" ${type === EventType.RESTAURANT ? 'checked' : ''}>
              <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
            </div>
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
        <datalist id="destination-list-1">

          ${destinationList}

        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}" ${isDisabled ? 'disabled' : ''}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}" ${isDisabled ? 'disabled' : ''}>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${totalPrice}" ${isDisabled ? 'disabled' : ''}>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">${isSaving ? 'Saving...' : 'Save'}</button>

      ${editModeTemplate}

    </header>
    <section class="event__details">

      ${offersTemplate}
      ${destinationTemplate}

    </section>
  </form>
</li>`;
};

export default class EditEventView extends AbstractStatefulView {

  #fromDatepicker = null;
  #toDatepicker = null;
  #currentEditMode = null;
  #destinations = null;

  constructor(event, editMode, destinations) {
    super();
    this._state = this.#convertEventToStatement(event);
    this.#currentEditMode = editMode;
    this.#destinations = destinations;

    this.#setDatepicker();
    this.#setInnerHandlers();
  }

  get template() {
    return createEditEventTemplate(this._state, this.#currentEditMode, this.#destinations);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#fromDatepicker) {
      this.#fromDatepicker.destroy();
      this.#fromDatepicker = null;
    }
    if (this.#toDatepicker) {
      this.#toDatepicker.destroy();
      this.#toDatepicker = null;
    }
  };

  #setDatepicker = () => {
    this.#fromDatepicker = flatpickr(
      this.element.querySelectorAll('#event-start-time-1'),
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.fromDate,
        onChange: this.#editFromDateHandler,
      },
    );
    this.#toDatepicker = flatpickr(
      this.element.querySelectorAll('#event-end-time-1'),
      {
        enableTime: true,
        'time_24hr': true,
        minDate: this._state.fromDate,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.toDate,
        onChange: this.#editToDateHandler,
      },
    );
  };

  #convertEventToStatement = (event) => ({
    ...event,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  #convertStatementToEvent = () => {
    const event = {...this._state};
    delete event.isDisabled;
    delete event.isSaving;
    delete event.isDeleting;
    return event;
  };

  reset = (event) => this.updateElement(this.#convertEventToStatement(event));

  #editFromDateHandler = ([userDate]) => {
    this.updateElement({
      fromDate: userDate,
    });
  };

  #editToDateHandler = ([userDate]) => {
    this.updateElement({
      toDate: userDate,
    });
  };

  setCloseEditFormHandler = (cb) => {
    this._callback.closeEditFormClick = cb;
    if (this.#currentEditMode === EditMode.NEW) {
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#closeEditFormHandler);
    }
    if (this.#currentEditMode === EditMode.EDIT) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeEditFormHandler);
    }
  };

  setDeleteEventHandler = (cb) => {
    this._callback.deleteEventClick = cb;
    if (this.#currentEditMode === EditMode.EDIT) {
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteEventHandler);
    }
  };

  setUpdateEventHandler = (cb) => {
    this._callback.updateEventClick = cb;
    this.element.querySelector('form').addEventListener('submit', this.#updateEventHadler);
  };

  setChangeEventTypeHandler = (cb) => {
    this._callback.chageEventTypeClick = cb;
    this.element.querySelector('.event__type-group').addEventListener('change', this.#changeEventTypeHandler);
  };

  setChangeEventDestinationHandler = (cb) => {
    this._callback.chageEventDestinationClick = cb;
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#changeEventDestinationHandler);
  };

  #changeEventTypeHandler = (evt) => {
    if (evt.target.closest('.event__type-input')) {
      evt.preventDefault();
      this.updateElement({
        type: evt.target.value,
        offers: this._callback.chageEventTypeClick(evt.target.value),
      });
    }
  };

  #changeEventDestinationHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      destination: {
        name: evt.target.value,
      }
    });
    if (this.#destinations.includes(evt.target.value)) {
      this.updateElement({
        destination: this._callback.chageEventDestinationClick(evt.target.value),
      });
      return;
    }
    if (this._state.destination.description !== '') {
      this.updateElement({
        destination: {
          name: evt.target.value,
          description: '',
          pictures: [],
        }
      });
    }
  };

  #closeEditFormHandler = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    this._callback.closeEditFormClick();
  };

  #deleteEventHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteEventClick(this.#convertStatementToEvent());
  };

  #updateEventHadler = (evt) => {
    evt.preventDefault();
    this._callback.updateEventClick(this.#convertStatementToEvent());
  };

  #editPriceHandler = (evt) => {
    evt.preventDefault();
    this._setState({totalPrice: +evt.target.value});
  };

  #editOffersHandler = (evt) => {
    evt.preventDefault();
    const offerId = evt.target.id;
    const offers = this._state.offers.map((offer) => offer.id === +offerId
      ? {
        ...offer,
        isSelected: evt.target.checked
      }
      : offer);

    this._setState({offers});
  };

  #setInnerHandlers = () => {
    if (this.#currentEditMode === EditMode.NEW) {
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#closeEditFormHandler);
    }
    if (this.#currentEditMode === EditMode.EDIT) {
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteEventHandler);
    }
    this.element.querySelector('.event__input--price').addEventListener('input', this.#editPriceHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#changeEventDestinationHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#changeEventTypeHandler);
    if (this._state.offers.length !== 0) {
      this.element.querySelector('.event__available-offers').addEventListener('change', this.#editOffersHandler);
    }
  };

  _restoreHandlers = () => {
    this.#setDatepicker();
    this.#setInnerHandlers();
    this.setUpdateEventHandler(this._callback.updateEventClick);
    this.setCloseEditFormHandler(this._callback.closeEditFormClick);
  };
}
