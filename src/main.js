import TripPresenter from './presenter/trip-presenter';
import EventsModel from './model/events-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import TripInfoPresenter from './presenter/trip-info-presenter';

const headerElement = document.querySelector('.trip-main');
const headerFiltersElement = document.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.trip-events');
const addEventButton = headerElement.querySelector('.trip-main__event-add-btn');

const filterModel = new FilterModel();
const eventsModel = new EventsModel();

const tripInfoPresenter = new TripInfoPresenter(headerElement, eventsModel);
const filterPresenter = new FilterPresenter(headerFiltersElement, eventsModel, filterModel);
const tripPresenter = new TripPresenter(mainElement, eventsModel, filterModel);

tripInfoPresenter.init();
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
