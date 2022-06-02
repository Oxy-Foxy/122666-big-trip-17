export const generateOffers = ()=> (
  [
    {
      type:'taxi',
      offers: [
        {
          id: 1,
          title: 'Upgrade to a business class',
          price: 120
        }, {
          id: 2,
          title: 'Choose the radio station',
          price: 60
        }
      ]
    },
    {
      type:'bus',
      offers: [
        {
          id: 1,
          title: 'Add baggage',
          price: 50
        }, {
          id: 2,
          title: 'Second floor',
          price: 80
        }
      ]
    },
    {
      type:'train',
      offers: [
        {
          id: 1,
          title: 'Add luggage',
          price: 50
        }, {
          id: 2,
          title: 'Switch to comfort class',
          price: 80
        }
      ]
    },
    {
      type:'ship',
      offers: [
        {
          id: 1,
          title: 'Add baggage',
          price: 50
        }, {
          id: 2,
          title: 'First class',
          price: 80
        }
      ]
    },
    {
      type:'drive',
      offers: [
        {
          id: 1,
          title: 'Add luggage',
          price: 50
        }, {
          id: 2,
          title: 'Personal driver',
          price: 80
        }
      ]
    },
    {
      type:'flight',
      offers: [
        {
          id: 1,
          title: 'Add meal',
          price: 50
        }, {
          id: 2,
          title: 'Choose seats',
          price: 80
        }
      ]
    },
    {
      type:'check-in',
      offers: [
        {
          id: 1,
          title: 'Get a binoculars',
          price: 50
        },
        {
          id: 2,
          title: 'Get private room',
          price: 80
        },
      ]
    },
    {
      type:'sightseeing',
      offers: [
        {
          id: 1,
          title: 'Get a guide',
          price: 50
        },
        {
          id: 2,
          title: 'Get an interpreter',
          price: 50
        },
      ]
    },
    {
      type:'restaurant',
      offers: [
        {
          id: 1,
          title: 'Get an apperitive',
          price: 50
        },
        {
          id: 2,
          title: 'Get a complement',
          price: 80
        },
      ]
    },
  ]
);
