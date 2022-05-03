import dayjs from 'dayjs';

const humanizeDate = (date) => dayjs(date).format('MMM DD');
const humanizeTime = (date) => dayjs(date).format('HH:mm');

const getDuration = (date1, date2) => {
  const fromDate = dayjs(date1);
  const toDate = dayjs(date2);
  const duration = fromDate.diff(toDate, 'minute');
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  return hours === 0 ? `${minutes}M` : `${hours}H ${minutes}M`;
};

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export {getRandomInteger, humanizeDate, getDuration, humanizeTime};
