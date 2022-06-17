import dayjs from 'dayjs';
import {FilterType} from './enums';

const getShortDate = (date) => dayjs(date).format('MMM D');
const getDate = (date) => dayjs(date).format('YYYY-MM-D');
const getTime = (date) => dayjs(date).format('HH:mm');
const getSimpleDifference = (date1, date2) => dayjs(date1).diff(dayjs(date2), 'm');
const getDifferenceInMinutes = (date1, date2) => Math.abs(dayjs(date1).diff(dayjs(date2), 'm'));
const getDifference = (date1, date2) => {
  const totalMinutes = Math.abs(dayjs(date1).diff(dayjs(date2), 'm'));
  const totalHours = totalMinutes / 60;
  const days = Math.floor(totalHours/24).toString().padStart(2, '0');
  const hours = Math.floor(totalHours % 24).toString().padStart(2, '0');
  const minutes = Math.floor(totalMinutes % 60).toString().padStart(2, '0');
  let result = '';
  if (days > 0) {
    result = `${days}d ${hours}h ${minutes}m`;
  }else if(days === 0 && hours > 0) {
    result = `${hours}h ${minutes}m`;
  } else {
    result = `${minutes}m`;
  }
  return result;
};
const toIsoString = (date) => dayjs(date).toISOString();
const getformDateTime = (date) => date ? dayjs(date).format('DD/MM/YY HH:mm') : dayjs();
const isPast = (endDate) => dayjs(endDate).diff(dayjs(), 'd') < 0;
const isFuture = (startDate) => dayjs(startDate).diff(dayjs(), 'd') >= 0;
const isCommon = (startDate, endDate) => dayjs(startDate).diff(dayjs(), 'd') < 0 && dayjs(endDate).diff(dayjs(), 'd') >= 0;

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuture(point.dateFrom) || isCommon(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPast(point.dateTo) || isCommon(point.dateFrom, point.dateTo)),
};

const sortByDate = (pointA, pointB)=> dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
const sortByDuration = (pointA, pointB)=>getDifferenceInMinutes(pointB.dateFrom, pointB.dateTo) - getDifferenceInMinutes(pointA.dateFrom, pointA.dateTo);
const sortByPrice = (pointA, pointB)=> pointB.basePrice - pointA.basePrice;

export { getShortDate, getDate, getTime, getDifference, getformDateTime, isPast, isFuture, filter, sortByDate, sortByDuration, sortByPrice, getSimpleDifference, toIsoString};
