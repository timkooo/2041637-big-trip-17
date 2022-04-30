import {getRandomInteger} from '../utils';
import {createOffersList} from './offer-dummy';
import dayjs from 'dayjs';


const getDestination = () => {
  const destinationList = ['Ankara', 'Berlin', 'Guatemala', 'Dublin', 'Jerusalem', 'Krakow', 'Liverpool', 'Mexico'];
  return destinationList[getRandomInteger(0, destinationList.length-1)];
};

const getType = () => {
  const typeList = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
  return typeList[getRandomInteger(0, typeList.length-1)];
};

const getDate = () => {
  const startDate = dayjs().add(getRandomInteger(3, 7), 'month').add(getRandomInteger(3, 20), 'day');
  const finishDate = startDate.add(getRandomInteger(30, 180), 'minute');
  return [startDate.toDate(), finishDate.toDate()];
};

const getOffers = (type) => createOffersList(type);

const createNewEvent = () => {
  const eventType = getType();
  const date = getDate();
  return {
    totalPrice: 100,
    fromDate : date[0],
    toDate : date[1],
    destination : getDestination(),
    id : '0',
    isFavorite : Boolean(getRandomInteger(0,1)),
    offers : getOffers(eventType),
    type : eventType,
  };
};

export {createNewEvent};
