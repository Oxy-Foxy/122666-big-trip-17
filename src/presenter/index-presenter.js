import filtersView from '../view/filters-view.js';
import sortView from '../view/sort-view.js';
import listView from '../view/list-view.js';
import listItemView from '../view/list-item-view.js';
import pointView from '../view/point-view.js';
import formCreateView from '../view/form-create-view.js';
import formUpdateView from '../view/form-update-view.js';
import {render} from '../render.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const contentContainer = document.querySelector('.trip-events');

export default class IndexPresenter {
  listComponent = new listView();
  formCreateContainer = new listItemView();
  formUpdateContainer = new listItemView();

  init = () => {
    render(new filtersView(), filtersContainer);
    render(new sortView(), contentContainer);
    render(this.listComponent, contentContainer);
    render(this.formUpdateContainer, this.listComponent.getElement());
    render(new formUpdateView(), this.formUpdateContainer.getElement());
    render(this.formCreateContainer, this.listComponent.getElement());
    render(new formCreateView(), this.formCreateContainer.getElement());

    for (let i = 0; i < 3; i++) {
      const item = new listItemView();
      render(item, this.listComponent.getElement());
      render(new pointView(), item.getElement());
    }
  };
}
