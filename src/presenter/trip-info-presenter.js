import TripInfoView from '../view/trip-info-view';
import {remove, render, RenderPosition, replace} from '../framework/render';
import {getTripInfo} from '../utils/common';
import {UpdateType} from '../utils/const';

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

    this.#tripInfoComponent = new TripInfoView(getTripInfo(this.#eventsModel.events));

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

  #modelUpdateHandler = (updateType) => {
    switch (updateType) {
      case UpdateType.PATCH:
      case UpdateType.MINOR:

        if (this.#eventsModel.events.length === 0) {
          remove(this.#tripInfoComponent);
          this.#prevTripInfoComponent = null;
          this.#tripInfoComponent = null;
          return;
        }
        this.init();
        break;
    }
  };
}
