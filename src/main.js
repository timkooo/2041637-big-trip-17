import {render} from './framework/render';
import TripInfoView from './view/trip-info-view';
import TripPresenter from './presenter/trip-presenter';
import EventsModel from './model/events-model';

const headerElement = document.querySelector('.trip-main');
const headerFiltersElement = document.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.trip-events');

render(new TripInfoView(), headerElement, 'afterbegin');

const eventsModel = new EventsModel();
const tripPresenter = new TripPresenter(mainElement, eventsModel, headerFiltersElement);

tripPresenter.init();
