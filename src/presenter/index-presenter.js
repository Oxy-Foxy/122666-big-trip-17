import sortView from '../view/sort-view';
import listView from '../view/list-view';
import EmptyMessageView from '../view/empty-message-view';
import PointPresenter from './point-presenter';
import NewPointPresenter from './new-point-presenter';
import {render, remove} from '../framework/render';
import {filter} from '../utils.js';
import {UpdateType, UserAction, FilterType} from '../enums.js';

const contentContainer = document.querySelector('.trip-events');

export default class IndexPresenter {
  #listComponent = null;
  #contentContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #filterModel = null;
  #emptyMessageElm = null;
  #offers = [];
  #filterType = FilterType.EVERYTHING;
  #pointPresenter = new Map();
  #newPointPresenter = null;

  constructor(pointsModel, offersModel, filterModel) {
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;
    this.#listComponent = new listView();
    this.#newPointPresenter = new NewPointPresenter(this.#listComponent, this.#handleViewAction);
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);
    return filteredPoints;
  }

  init = () => {
    this.#contentContainer = contentContainer;
    this.#offers = [...this.#offersModel.offers];


    if(!this.points.length){
      this.#renderEmptyMessage();
      return;
    }
    this.#renderSort();
    this.#renderPoints();
  };

  createPoint = (callback) => {
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init(callback);
  };

  #renderPoints = ()=>{
    const points = this.points;
    render(this.#listComponent, this.#contentContainer);

    for (let i = 0; i < points.length; i++) {
      this.#renderPoint(points[i]);
    }
  };

  #renderPoint = (point)=> {
    const pointPresenter = new PointPresenter(this.#listComponent, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point, this.#offers);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderEmptyMessage = ()=>{
    this.#emptyMessageElm = new EmptyMessageView(this.#filterType);
    render(this.#emptyMessageElm, this.#contentContainer);
  };

  #renderSort = ()=>{
    render(new sortView(), this.#contentContainer);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
    this.#newPointPresenter.destroy();
  };

  #clearPoints = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
    if (this.#emptyMessageElm) {
      remove(this.#emptyMessageElm);
    }
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPoints();
        this.#renderPoints();
        break;
      case UpdateType.MAJOR:
        this.#clearPoints();
        this.#renderPoints();
        break;
    }
  };
}
