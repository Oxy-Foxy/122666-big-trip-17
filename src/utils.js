import dayjs from 'dayjs';
import {FilterType} from './enums';

const getShortDate = (date) => dayjs(date).format('MMM D');
const getDate = (date) => dayjs(date).format('YYYY-MM-D');
const getTime = (date) => dayjs(date).format('HH:mm');
const getDifference = (date1, date2) => {
  const totalMinutes = Math.abs(dayjs(date1).diff(dayjs(date2), 'm'));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes%60;
  return `${hours}h ${minutes}m`;
};
const getformDateTime = (date) => date ? dayjs(date).format('DD/MM/YY HH:mm') : dayjs();
const isPast = (endDate) => dayjs(endDate).diff(dayjs(), 'd') < 0;
const isFuture = (startDate) => dayjs(startDate).diff(dayjs(), 'd') >= 0;

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuture(point.dateFrom)),
  [FilterType.PAST]: (points) => points.filter((point) => isPast(point.dateTo)),
};

export { getShortDate, getDate, getTime, getDifference, getformDateTime, isPast, isFuture, filter};
