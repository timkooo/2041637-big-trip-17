import {render} from './render';
import FiltersView from './view/filters-view';
import TripInfoView from './view/trip-info-view';
import TripPresenter from './presenter/trip-presenter';
import EventModel from './model/event-model';
import {createOffersList, getOffersList} from './mock/event';

createOffersList();
console.log(getOffersList());

const headerElement = document.querySelector('.trip-main');
const headerFiltersElement = document.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.trip-events');

render(new TripInfoView(), headerElement, 'afterbegin');
render(new FiltersView(), headerFiltersElement);

const tripPresenter = new TripPresenter();
const eventsModel = new EventModel();

tripPresenter.init(mainElement, eventsModel);
