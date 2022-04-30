import dayjs from 'dayjs';

const humanizeDate = (date) => dayjs(date).format('MMM DD');
const humanizeTime = (date) => dayjs(date).format('HH:mm');

const getDuration = (date1, date2) => {
  const a = dayjs(date1);
  const b = dayjs(date2);
  const minutes = a.diff(b, 'minute');
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}H ${m}M`;
};

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export {getRandomInteger, humanizeDate, getDuration, humanizeTime};
