import sortView from '../view/sort-view';
import listView from '../view/list-view';
import EmptyMessageView from '../view/empty-message-view';
import PointPresenter from './point-presenter';
import NewPointPresenter from './new-point-presenter';
import LoadingView from '../view/loading-view.js';
import {render, remove} from '../framework/render';
import {filter} from '../utils.js';
import {UpdateType, UserAction, FilterType} from '../enums.js';

const contentContainer = document.querySelector('.trip-events');

export default class IndexPresenter {
  #loadingComponent = new LoadingView();
  #listComponent = new listView();
  #sortComponent = new sortView();
  #contentContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;
  #emptyMessageElm = null;
  #offers = [];
  #destinations = [];
  #filterType = FilterType.EVERYTHING;
  #pointPresenter = new Map();
  #newPointPresenter = null;
  #isLoading = true;
  #enableNewPointBtn = null;

  constructor(pointsModel, offersModel, filterModel, destinationsModel) {
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
    this.#newPointPresenter = new NewPointPresenter(this.#listComponent, this.#handleViewAction);
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
    this.#destinationsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);
    return filteredPoints;
  }

  init = (callback) => {
    this.#enableNewPointBtn = callback;
    this.#contentContainer = contentContainer;
    this.#offers = [...this.#offersModel.offers];
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#renderPage();
  };

  createPoint = () => {
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init(this.#enableNewPointBtn,this.#offers, this.#destinations);
  };

  #renderPage = ()=>{
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if(!this.#offers.length || !this.#destinations.length) {
      this.#renderErrorMessage();
      return;
    }

    this.#enableNewPointBtn();
    if(!this.points.length){
      this.#renderEmptyMessage();
      return;
    }

    this.#renderSort();
    this.#renderPoints();
  };

  #renderErrorMessage(){
    console.log('error');
  }

  #renderPoints = ()=>{
    const points = this.points;
    render(this.#listComponent, this.#contentContainer);

    for (let i = 0; i < points.length; i++) {
      this.#renderPoint(points[i]);
    }
  };

  #renderPoint = (point)=> {
    const pointPresenter = new PointPresenter(this.#listComponent, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point, this.#offers, this.#destinations);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderEmptyMessage = ()=>{
    this.#emptyMessageElm = new EmptyMessageView(this.#filterType);
    remove(this.#loadingComponent);
    render(this.#emptyMessageElm, this.#contentContainer);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#contentContainer);
  };

  #renderSort = ()=>{
    render(this.#sortComponent, this.#contentContainer);
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
    if(this.#sortComponent){
      remove(this.#sortComponent);
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
      case UpdateType.INIT:
        this.#offers = [...this.#offersModel.offers];
        this.#destinations = [...this.#destinationsModel.destinations];
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderPage();
        break;
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPoints();
        this.#renderPage();
        break;
      case UpdateType.MAJOR:
        this.#clearPoints();
        this.#renderPage();
        break;
    }
  };
}
