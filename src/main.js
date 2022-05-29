import {render} from './framework/render';
import TripInfoView from './view/trip-info-view';
import TripPresenter from './presenter/trip-presenter';
import EventsModel from './model/events-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';

const headerElement = document.querySelector('.trip-main');
const headerFiltersElement = document.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.trip-events');
const addEventButton = headerElement.querySelector('.trip-main__event-add-btn');

render(new TripInfoView(), headerElement, 'afterbegin');

const filterModel = new FilterModel();
const eventsModel = new EventsModel();

const filterPresenter = new FilterPresenter(headerFiltersElement, eventsModel, filterModel);
const tripPresenter = new TripPresenter(mainElement, eventsModel, filterModel);

filterPresenter.init();
tripPresenter.init();

const closeNewEventFormHandler = () => {
  addEventButton.desabled = false;
};

const openNewEventFormHandler = (evt) => {
  evt.preventDefault();
  tripPresenter.addNewEvent(closeNewEventFormHandler);
  addEventButton.desabled = true;
};

addEventButton.addEventListener('click', openNewEventFormHandler);
