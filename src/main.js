import TripPresenter from './presenter/trip-presenter';
import EventsModel from './model/events-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import TripInfoPresenter from './presenter/trip-info-presenter';
import EventsApiService from './events-api-service';

const AUTHORIZATION = 'Basic mfgk59ofm3orfk36r8dm';
const END_POINT = 'https://17.ecmascript.pages.academy/big-trip';

const headerElement = document.querySelector('.trip-main');
const headerFiltersElement = document.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.trip-events');
const addEventButton = headerElement.querySelector('.trip-main__event-add-btn');

const filterModel = new FilterModel();
const eventsModel = new EventsModel(new EventsApiService(END_POINT, AUTHORIZATION));

const tripInfoPresenter = new TripInfoPresenter(headerElement, eventsModel);
const filterPresenter = new FilterPresenter(headerFiltersElement, eventsModel, filterModel);
const tripPresenter = new TripPresenter(mainElement, eventsModel, filterModel);

const closeNewEventFormHandler = () => {
  addEventButton.disabled = false;
};

const openNewEventFormHandler = (evt) => {
  evt.preventDefault();
  tripPresenter.addNewEvent(closeNewEventFormHandler);
  addEventButton.disabled = true;
};

tripPresenter.init();
eventsModel.init().finally(() => {
  tripInfoPresenter.init();
  filterPresenter.init();
  addEventButton.addEventListener('click', openNewEventFormHandler);
});

