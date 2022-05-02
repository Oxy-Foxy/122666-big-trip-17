export const generateOffer = (type)=> ({
  type,
  offers: [
    {
      id: 1,
      title: 'Add luggage',
      price: 50
    }, {
      id: 2,
      title: 'Switch to comfort',
      price: 80
    }
  ]
}
);
