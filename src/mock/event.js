import {getRandomInteger} from '../utils/common';
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

const offersList = [];

const offerTypeList = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const descriptionText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.
Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis
sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur
ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed
augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac
purus sit amet tempus.`;

const offersTaxi = [
  {
    id: 1,
    title : 'Get car Volvo',
    price : 20
  },
  {
    id: 2,
    title : 'Get car Mercedes',
    price : 40
  },
  {
    id: 3,
    title : 'Get car Bentley',
    price : 60
  }
];

const offersRestaurant = [
  {
    id: 1,
    title : 'Musicians performance',
    price : 15
  },
  {
    id: 2,
    title : 'Free drinks',
    price : 30
  },
  {
    id: 3,
    title : 'All inclusive',
    price : 50
  }
];

const eventTypeToOffersList = {
  'taxi': offersTaxi,
  'restaurant': offersRestaurant,
  'bus': offersTaxi,
  'train': offersRestaurant,
  'drive': offersTaxi,
  'check-in': offersRestaurant,
  'sightseeing': offersRestaurant,
  'ship': offersTaxi,
  'flight': offersTaxi,
};

const getDestinationName = () => {
  const destinationList = ['Ankara', 'Berlin', 'Guatemala', 'Dublin', 'Jerusalem', 'Krakow', 'Liverpool', 'Mexico'];
  return destinationList[getRandomInteger(0, destinationList.length-1)];
};

const getType = () => offerTypeList[getRandomInteger(0, offerTypeList.length-1)];

const getDate = () => {
  const fromDate = dayjs().add(getRandomInteger(-3, 3), 'month').add(getRandomInteger(3, 20), 'day').toDate();
  const toDate = dayjs(fromDate).add(getRandomInteger(17, 21), 'hour').add(getRandomInteger(200, 400), 'minute').toDate();
  return {
    fromDate,
    toDate,
  };
};

const createOffersByType = (eventType) => ({
  type: eventType,
  offers: eventTypeToOffersList[eventType],
});

const createOffersList = () => {
  if (offersList.length === 0) {
    return offerTypeList.forEach((offerType) => offersList.push(createOffersByType(offerType)));
  }
};

const getOffersList = () => offersList;

const sortOffers = (offer1, offer2) => {
  if (offer1.isSelected === offer2.isSelected) {
    return 0;
  }
  if (offer1.isSelected > offer2.isSelected) {
    return -1;
  }
  return 1;
};

const getOffersByType = (eventType) => {
  const offers = offersList.slice();
  const offersByType = offers.find((off) => off.type === eventType).offers;
  if (offersByType) {
    const mappedOffers = offersByType.map((offer) => ({...offer, isSelected : Boolean(getRandomInteger(0,1))}));
    return mappedOffers.sort((a, b) => sortOffers(a, b));
  }
  return [];
};

const getDescription = () => {
  let description = '';
  const descriptions = descriptionText.split('. ');
  for (let i = 0; i < 5; i++) {
    description += `${descriptions[getRandomInteger(0, descriptions.length - 1)]}. `;
  }
  return description;
};

const getPictures = () => {
  const pictures = [];
  for (let i = 0; i < 5; i++) {
    const picture = {
      src : `http://picsum.photos/248/152?r=${getRandomInteger(0,100)}`,
      description : 'dasdasdasdadas',
    };
    pictures.push(picture);
  }
  return pictures;
};

const getDestination = () => ({
  description: getDescription(),
  name: getDestinationName(),
  pictures: getPictures(),
});

const getPrice = () => getRandomInteger(20, 300);

const createEvent = () => {
  const eventType = getType();
  const date = getDate();
  return {
    totalPrice: getPrice(),
    fromDate : date.fromDate,
    toDate : date.toDate,
    destination : getDestination(),
    id : nanoid(),
    isFavorite : Boolean(getRandomInteger(0,1)),
    offers : getOffersByType(eventType),
    type : eventType,
  };
};

export {createEvent, createOffersList, getOffersList};
