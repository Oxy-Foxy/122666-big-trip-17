import AbstractView from '../framework/view/abstract-view';

const createNewListItemTemplate = () => '<li class="trip-events__item"></li>';

export default class ListItemView extends AbstractView {
  get template() {
    return createNewListItemTemplate();
  }
}
