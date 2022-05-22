import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

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

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export {getRandomInteger, humanizeDate, getDuration, humanizeTime, updateItem, humanizeEditTime};
