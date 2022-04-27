import {render} from './render';
import FiltersListView from './view/filters-list-view';
import TripInfoView from './view/trip-info-view';
import Presenter from './presenter/presenter';

const headerElement = document.querySelector('.trip-main');
const headerFiltersElement = document.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.trip-events');

render(new TripInfoView(), headerElement, 'afterbegin');
render(new FiltersListView(), headerFiltersElement);

const presenter = new Presenter();

presenter.init(mainElement);
