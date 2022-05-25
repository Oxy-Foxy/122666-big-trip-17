import filtersView from '../view/filters-view';
import sortView from '../view/sort-view';
import listView from '../view/list-view';
import EmptyMessageView from '../view/empty-message-view';
import PointPresenter from './point-presenter';
import {render} from '../framework/render';
import {updateItem} from '../utils';

const filtersContainer = document.querySelector('.trip-controls__filters');
const contentContainer = document.querySelector('.trip-events');

export default class IndexPresenter {
  #listComponent = null;
  #filtersContainer = null;
  #contentContainer = null;
  #pointsModel = null;
  #emptyMessageElm = new EmptyMessageView();
  #offersModel = null;
  #points = [];
  #offers = [];
  #pointPresenter = new Map();

  init = (pointsModel, offersModel) => {
    this.#listComponent = new listView();
    this.#filtersContainer = filtersContainer;
    this.#contentContainer = contentContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#points = [...this.#pointsModel.points];
    this.#offers = [...this.#offersModel.offers];

    this.#renderFilters();
    if(this.#points.length){
      this.#renderSort();
      this.#renderPoints();
    } else {
      this.#renderEmptyMessage();
    }
  };

  #renderPoints = ()=>{
    render(this.#listComponent, this.#contentContainer);

    for (let i = 0; i < this.#points.length; i++) {
      this.#renderPoint(this.#points[i]);
    }
  };

  #renderPoint = (point)=> {
    const offersOfType = this.#offers.filter((offersItem) => offersItem.type === point.type)[0];
    const pointPresenter = new PointPresenter(this.#listComponent, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point, offersOfType.offers);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderFilters = ()=>{
    render(new filtersView(), this.#filtersContainer);
  };

  #renderEmptyMessage = ()=>{
    render(this.#emptyMessageElm, this.#contentContainer);
  };

  #renderSort = ()=>{
    render(new sortView(), this.#contentContainer);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint)=> {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#clearPoints();
    this.#renderPoints();
  };

  #clearPoints = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };
}
