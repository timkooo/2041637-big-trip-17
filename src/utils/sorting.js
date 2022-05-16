import dayjs from 'dayjs';

const SortingTypes = {
  DAY: 'sort-day',
  EVENT: 'sort-event',
  TIME: 'sort-time',
  PRICE: 'sort-price',
  OFFER: 'sort-offer',
};

const sortByDay = (event1, event2) => {
  if (dayjs(event1.fromDate).isAfter(event2.fromDate)) {
    return 1;
  }
  if (dayjs(event1.fromDate).isBefore(event2.fromDate)) {
    return -1;
  }
  return 0;
};

const sortByTime = (event1, event2) => {
  const duration1 = dayjs(event1.fromDate).diff(dayjs(event1.toDate), 'minute');
  const duration2 = dayjs(event2.fromDate).diff(dayjs(event2.toDate), 'minute');
  if (duration1 > duration2) {
    return 1;
  }
  if (duration1 < duration2) {
    return -1;
  }
  return 0;
};

const sortByPrice = (event1, event2) => {
  if (event1.totalPrice < event2.totalPrice) {
    return 1;
  }
  if (event1.totalPrice > event2.totalPrice) {
    return -1;
  }
  return 0;
};

const sorting = {
  [SortingTypes.DAY] : (event1, event2) => sortByDay(event1, event2),
  [SortingTypes.TIME] : (event1, event2) => sortByTime(event1, event2),
  [SortingTypes.PRICE] : (event1, event2) => sortByPrice(event1, event2),
};

export {sorting, SortingTypes};
