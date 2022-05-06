//import {render} from './render';
import {render} from './framework/render';
import FiltersView from './view/filters-view';
import TripInfoView from './view/trip-info-view';
import TripPresenter from './presenter/trip-presenter';
import EventModel from './model/event-model';

const headerElement = document.querySelector('.trip-main');
const headerFiltersElement = document.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.trip-events');

render(new TripInfoView(), headerElement, 'afterbegin');
render(new FiltersView(), headerFiltersElement);

const tripPresenter = new TripPresenter();
const eventModel = new EventModel();

tripPresenter.init(mainElement, eventModel);
