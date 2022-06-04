import AbstractView from '../framework/view/abstract-view';
import {humanizeDate} from '../utils/common';

const createTripInfoTemplate = (tripInfo) => {

  const {fromDestination, toDestination, thirdDestination, fromDate, toDate, tripPrice} = tripInfo;

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${fromDestination}${thirdDestination ? thirdDestination: ' &mdash; '}${toDestination}</h1>

      <p class="trip-info__dates">${humanizeDate(fromDate)}&nbsp;&mdash;&nbsp;${humanizeDate(toDate)}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripPrice}</span>
    </p>
  </section>`;
};

export default class TripInfoView extends AbstractView{

  #tripInfo = null;

  constructor(tripInfo) {
    super();
    this.#tripInfo = tripInfo;
  }

  get template() {
    return createTripInfoTemplate(this.#tripInfo);
  }

}
