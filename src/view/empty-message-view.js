import AbstractView from '../framework/view/abstract-view';
import {FilterType} from '../enums.js';

const emptyMessageTypes = {
  [FilterType.EVERYTHING]:'Click New Event to create your first point',
  [FilterType.PAST]:'No past events',
  [FilterType.FUTURE]:'No future events',
};

const createNewEmptyMessageTemplate = (filterType) => {
  const message = emptyMessageTypes[filterType];
  return `<p class="trip-events__msg">${message}</p>`;
};

export default class EmptyMessageView extends AbstractView {
  #filterType = null;

  constructor(filterType){
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNewEmptyMessageTemplate(this.#filterType);
  }
}
