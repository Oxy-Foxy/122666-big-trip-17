export const generatePoint = (destination, offers)=> {
  const type = 'bus';
  const pointOffers = offers.filter((offer)=>offer.type === type)[0].offers;
  return {
    basePrice: 1100,
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    destination,
    id: '0',
    isFavorite: false,
    offers:pointOffers,
    type
  };
};
