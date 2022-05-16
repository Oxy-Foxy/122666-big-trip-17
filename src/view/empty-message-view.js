import {createElement} from '../render';

const createNewEmptyMessageTemplate = (message) => `<p class="trip-events__msg">${message}</p>`;

export default class EmptyMessageView {
  #element = null;
  #message = 'Click New Event to create your first point';
  constructor(message){
    this.#message = message ? message : this.#message;
  }

  get template() {
    return createNewEmptyMessageTemplate(this.#message);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
