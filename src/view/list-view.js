import {createElement} from '../render';

const createNewListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class ListView {
  #element = null;
  get template() {
    return createNewListTemplate();
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
