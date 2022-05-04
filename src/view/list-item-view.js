import {createElement} from '../render';

const createNewListItemTemplate = () => '<li class="trip-events__item"></li>';

export default class NewListItemView {
  getTemplate() {
    return createNewListItemTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
