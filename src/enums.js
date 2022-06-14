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

const PointTypes = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export {UserAction, UpdateType, FilterType, Mode, PointTypes};
