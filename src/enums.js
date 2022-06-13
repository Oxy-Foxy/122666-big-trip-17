const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT_OFFERS:'INIT_OFFERS',
  INIT_POINTS:'INIT_POINTS',
  INIT_DESTINATIONS:'INIT_DESTINATIONS'
};

const FilterType = {
  EVERYTHING:'everything',
  FUTURE:'future',
  PAST:'past'
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const SortVariants = {
  DAY: 'day',
  DURATION: 'duration',
  PRICE: 'price'
};

const SortTypes =
  [
    {
      name: 'Day',
      type: 'day',
      checked: true,
      sortBy: SortVariants.DAY
    },
    {
      name: 'Event',
      type: 'event',
      disabled: true
    },
    {
      name: 'Time',
      type: 'time',
      sortBy: SortVariants.DURATION
    },
    {
      name: 'Price',
      type: 'price',
      sortBy: SortVariants.PRICE
    },
    {
      name: 'Offer',
      type: 'offer',
      disabled: true
    },
  ];

const PointTypes = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export {UserAction, UpdateType, FilterType, Mode, PointTypes, SortTypes, SortVariants};
