import {getRandomInteger} from '../utils';

const offers = {
  'taxi' : [{
    id : 1,
    title : 'Volvo',
    price : 60
  },
  {
    id : 2,
    title : 'Mercedes',
    price : 60
  }],
  'sightseeing' : [{
    id : 1,
    title : 'Book tickets',
    price : 15
  },
  {
    id : 2,
    title : 'Lunch in city',
    price : 30
  },
  {
    id : 3,
    title : 'Skydiving',
    price : 50
  }],
  'restaurant' : [{
    id : 1,
    title : 'Musicians performance',
    price : 15
  },
  {
    id : 2,
    title : 'Free drinks',
    price : 30
  },
  {
    id : 3,
    title : 'All inclusive',
    price : 50
  }]
};

const getOffers = () => offers;

const createOffersList = (type) => {
  const offersList = [];
  if (offers[type]) {
    const offerType = offers[type];
    offersList.push(offerType[getRandomInteger(0, offerType.length-1)].id);
    offersList.push(offerType[getRandomInteger(0, offerType.length-1)].id);
  }
  return offersList;
};

export {createOffersList, getOffers};
