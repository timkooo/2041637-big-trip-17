import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {sorting, SortingTypes} from './sorting';

const humanizeDate = (date) => dayjs(date).format('MMM DD');
const humanizeTime = (date) => dayjs(date).format('HH:mm');
const humanizeEditTime = (date) => dayjs(date).format('DD/MM/YY HH:mm');

const getDuration = (date1, date2) => {
  const fromDate = dayjs(date1);
  const toDate = dayjs(date2);
  const minutes = fromDate.diff(toDate, 'minute');
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes - days * 1440 ) / 60);
  dayjs.extend(duration);
  if (days === 0 && hours !== 0) {
    return `${dayjs.duration(minutes, 'minutes').format('HH[H] mm[M]')}`;
  }
  if (days === 0 && hours === 0) {
    return `${dayjs.duration(minutes, 'minutes').format('mm[M]')}`;
  }
  return `${dayjs.duration(minutes, 'minutes').format('DD[D] HH[H] mm[M]')}`;
};

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getTripInfo = (tripEvents) => {
  const events = [...tripEvents].sort(sorting[SortingTypes.DAY]);

  const getOffersPrice = (event) => {
    if (event.offers.length === 0) {
      return 0;
    }
    const selectedOffers = event.offers.filter((offer) => offer.isSelected === true);
    return selectedOffers.reduce((accumulator, offer) => accumulator + +offer.price, 0);
  };

  const getTripPrice = () => events.reduce((accumulator, event) => accumulator + +event.totalPrice + +getOffersPrice(event), 0);

  const getThirdDestination = () => {
    if (events.length > 3) {
      return ' &mdash;&nbsp;&nbsp;.&nbsp;.&nbsp;.&nbsp;&nbsp;&mdash; ';
    }
    if (events.length === 3) {
      return ` &mdash; ${events[1].destination.name} &mdash; `;
    }
    if (events.length < 2) {
      return ' &mdash; ';
    }
  };

  return {
    fromDestination: events[0] ? events[0].destination.name : '',
    toDestination: events.length >= 2 ? events[events.length - 1].destination.name : '.&nbsp;.&nbsp;.',
    thirdDestination: getThirdDestination(),
    fromDate: events[0].fromDate,
    toDate: events[events.length - 1].toDate,
    tripPrice: getTripPrice(),
  };
};

export {getRandomInteger, humanizeDate, getDuration, humanizeTime, humanizeEditTime, getTripInfo};
