import filtersView from '../view/filters-view';
import sortView from '../view/sort-view';
import listView from '../view/list-view';
import listItemView from '../view/list-item-view';
import pointView from '../view/point-view';
import formCreateView from '../view/form-create-view';
import formUpdateView from '../view/form-update-view';
import {render} from '../render';

const filtersContainer = document.querySelector('.trip-controls__filters');
const contentContainer = document.querySelector('.trip-events');

export default class IndexPresenter {
  listComponent = new listView();
  formCreateContainer = new listItemView();
  formUpdateContainer = new listItemView();

  init = (pointsModel) => {
    this.pointsModel = pointsModel;
    this.points = [...this.pointsModel.getPoints()];
    render(new filtersView(), filtersContainer);
    render(new sortView(), contentContainer);
    render(this.listComponent, contentContainer);
    render(this.formUpdateContainer, this.listComponent.getElement());
    render(new formUpdateView(this.points[0]), this.formUpdateContainer.getElement());
    render(this.formCreateContainer, this.listComponent.getElement());
    render(new formCreateView(), this.formCreateContainer.getElement());

    for (let i = 0; i < this.points.length; i++) {
      const item = new listItemView();
      render(item, this.listComponent.getElement());
      render(new pointView(this.points[i]), item.getElement());
    }
  };
}
