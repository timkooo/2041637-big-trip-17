import dayjs from 'dayjs';

const FilterTypes = {
  EVERYTHING : 'everything',
  FUTURE : 'future',
  PAST : 'past',
};

const isEventDateFuture = (event) => dayjs().isBefore(event.fromDate, 'D');

const isEventDatePast = (event) => dayjs().isAfter(event.fromDate, 'D');

const filter = {
  [FilterTypes.EVERYTHING] : (event) => (event),
  [FilterTypes.FUTURE] : (event) => isEventDateFuture(event),
  [FilterTypes.PAST] : (event) => isEventDatePast(event),
};

export {filter, FilterTypes};
