import {createElement} from '../render';

const createNewListItemTemplate = () => '<li class="trip-events__item"></li>';

export default class ListItemView {
  #element = null;
  get template() {
    return createNewListItemTemplate();
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
