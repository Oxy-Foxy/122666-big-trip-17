import AbstractView from '../framework/view/abstract-view';

const createNewEmptyMessageTemplate = (message) => `<p class="trip-events__msg">${message}</p>`;

export default class EmptyMessageView extends AbstractView {
  #message = 'Click New Event to create your first point';
  constructor(incomingMessage){
    super();
    this.#message = incomingMessage ? incomingMessage : this.#message;
  }

  get template() {
    return createNewEmptyMessageTemplate(this.#message);
  }
}
