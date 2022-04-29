import {render} from './render';
import FiltersView from './view/filters-view';
import TripInfoView from './view/trip-info-view';
import TripPresenter from './presenter/presenter';

const headerElement = document.querySelector('.trip-main');
const headerFiltersElement = document.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.trip-events');

render(new TripInfoView(), headerElement, 'afterbegin');
render(new FiltersView(), headerFiltersElement);

const presenter = new TripPresenter();

presenter.init(mainElement);
