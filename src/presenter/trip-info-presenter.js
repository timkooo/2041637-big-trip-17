import TripInfoView from '../view/trip-info-view';
import {remove, render, RenderPosition, replace} from '../framework/render';
import {sorting, SortingTypes} from '../utils/sorting';


export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #tripInfoComponent = null;
  #eventsModel = null;
  #prevTripInfoComponent = null;

  constructor(tripInfoContainer, eventsModel) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#eventsModel = eventsModel;
    this.#eventsModel.addObserver(this.#modelUpdateHandler);
  }

  init = () => {
    this.#prevTripInfoComponent = this.#tripInfoComponent;

    this.#tripInfoComponent = new TripInfoView(this.#getTripInfo());

    if (this.#prevTripInfoComponent === null) {
      render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, this.#prevTripInfoComponent);
    remove(this.#prevTripInfoComponent);
  };

  destroy = () => {
    remove(this.#tripInfoComponent);
  };

  #getTripInfo = () => {
    const events = [...this.#eventsModel.events].sort(sorting[SortingTypes.DAY]);

    const getOffersPrice = (event) => {
      if (event.offers.length === 0) {
        return 0;
      }
      const selectedOffers = event.offers.filter((offer) => offer.isSelected === true);
      return selectedOffers.reduce((accumulator, offer) => accumulator + +offer.price, 0);
    };

    const getTripPrice = () => events.reduce((accumulator, event) => accumulator + +event.totalPrice + +getOffersPrice(event), 0);

    const getThirdDestination = () => {
      if (events.length > 3) {
        return ' &mdash;&nbsp;&nbsp;.&nbsp;.&nbsp;.&nbsp;&nbsp;&mdash; ';
      }
      if (events.length === 3) {
        return ` &mdash; ${events[1].destination.name} &mdash; `;
      }
      if (events.length < 2) {
        return ' &mdash; ';
      }
    };

    return {
      fromDestination: events[0] ? events[0].destination.name : '',
      toDestination: events.length >= 2 ? events[events.length - 1].destination.name : '.&nbsp;.&nbsp;.',
      thirdDestination: getThirdDestination(),
      fromDate: events[0].fromDate,
      toDate: events[events.length - 1].toDate,
      tripPrice: getTripPrice(),
    };
  };

  #modelUpdateHandler = () => {
    if (this.#eventsModel.events.length === 0) {
      remove(this.#tripInfoComponent);
      this.#prevTripInfoComponent = null;
      this.#tripInfoComponent = null;
      return;
    }
    this.init();
  };

}
