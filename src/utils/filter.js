import dayjs from 'dayjs';

const FilterTypes = {
  FUTURE : 'future',
  PAST : 'past',
};

const isEventDateFuture = (event) => dayjs().isBefore(event.fromDate, 'D');

const isEventDatePast = (event) => dayjs().isAfter(event.fromDate, 'D');

const filter = {
  [FilterTypes.FUTURE] : (event) => isEventDateFuture(event),
  [FilterTypes.PAST] : (event) => isEventDatePast(event),
};

export {filter, FilterTypes};
