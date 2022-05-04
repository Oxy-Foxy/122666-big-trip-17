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

  init = (pointsModel, offersModel) => {
    this.pointsModel = pointsModel;
    this.offersModel = offersModel;
    this.points = [...this.pointsModel.getPoints()];
    this.offers = [...this.offersModel.getOffers()];
    render(new filtersView(), filtersContainer);
    render(new sortView(), contentContainer);
    render(this.listComponent, contentContainer);


    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      const offersOfType = this.offers.filter((offersItem) => offersItem.type === point.type)[0];
      const item = new listItemView();
      if(i===0){
        render(item, this.listComponent.getElement());
        render(new formUpdateView(point, offersOfType.offers), item.getElement());
      } else {
        render(item, this.listComponent.getElement());
        render(new pointView(point, offersOfType.offers), item.getElement());
      }
    }

    render(this.formCreateContainer, this.listComponent.getElement());
    render(new formCreateView(), this.formCreateContainer.getElement());
  };
}
