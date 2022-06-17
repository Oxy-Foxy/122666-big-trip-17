import AbstractView from '../framework/view/abstract-view';
import {FilterType} from '../enums.js';

const emptyMessageTypes = {
  [FilterType.EVERYTHING]:'Click New Event to create your first point',
  [FilterType.PAST]:'There are no past events now',
  [FilterType.FUTURE]:'There are no future events now',
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
