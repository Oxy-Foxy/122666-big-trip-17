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

export { getShortDate, getDate, getTime, getDifference, getformDateTime, updateItem};
