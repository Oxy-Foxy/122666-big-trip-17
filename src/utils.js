import dayjs from 'dayjs';


const getShortDate = (date) => dayjs(date).format('MMM D');
const getDate = (date) => dayjs(date).format('YYYY-MM-D');
const getTime = (date) => dayjs(date).format('HH:mm');
const getDifference = (date1, date2) => {
  const totalMinutes = Math.abs(dayjs(date1).diff(dayjs(date2), 'm'));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes%60;
  return `${hours}h ${minutes}m`;
};
const getformDateTime = (date) => dayjs(date).format('DD/MM/YY HH:mm');


export { getShortDate, getDate, getTime, getDifference, getformDateTime};
