import SortView from '../view/sort-view';
import listView from '../view/list-view';
import EmptyMessageView from '../view/empty-message-view';
import PointPresenter from './point-presenter';
import NewPointPresenter from './new-point-presenter';
import LoadingView from '../view/loading-view.js';
import ErrorView from '../view/error-view.js';
import FilterModel from '../model/filter-model.js';
import FilterPresenter from '../presenter/filter-presenter.js';
import {render, remove, RenderPosition} from '../framework/render';
import {filter, sortByDate, sortByDuration, sortByPrice} from '../utils.js';
import {UpdateType, UserAction, FilterType, SortVariants} from '../enums.js';

const contentContainer = document.querySelector('.trip-events');

export default class IndexPresenter {
  #loadingComponent = new LoadingView();
  #errorComponent = new ErrorView();
  #listComponent = new listView();
  #sortComponent = new SortView();
  #filtersModel = new FilterModel();
  #filterPresenter = null;
  #contentContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #emptyMessageElm = null;
  #offers = [];
  #destinations = [];
  #filterType = FilterType.EVERYTHING;
  #pointPresenter = new Map();
  #newPointPresenter = null;
  #isLoading = true;
  #enableNewPointBtn = null;
  #resourses = {};
  #currentSortType = SortVariants.DAY;

  constructor(pointsModel, offersModel, destinationsModel) {
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#newPointPresenter = new NewPointPresenter(this.#listComponent, this.#handleViewAction);
    this.#filterPresenter = new FilterPresenter(this.#filtersModel, this.#pointsModel);
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
    this.#destinationsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filtersModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortVariants.DAY:
        return filteredPoints.sort(sortByDate);
      case SortVariants.DURATION:
        return filteredPoints.sort(sortByDuration);
      case SortVariants.PRICE:
        return filteredPoints.sort(sortByPrice);
    }
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
    this.#currentSortType = SortVariants.DAY;
    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init(this.#enableNewPointBtn,this.#offers, this.#destinations);
  };

  #renderPage = ()=>{
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if(!this.points.length){
      this.#renderEmptyMessage();
      return;
    }

    this.#renderSort();
    this.#renderPoints();
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

  #renderErrorComponent = () => {
    render(this.#errorComponent, this.#contentContainer);
  };

  #renderSort = ()=>{
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#contentContainer, RenderPosition.AFTERBEGIN);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPoints({resetSortType: false});
    this.#renderPage();
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
    this.#newPointPresenter.destroy();
  };

  #clearPoints = ({resetSortType = false}={}) => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
    if (this.#emptyMessageElm) {
      remove(this.#emptyMessageElm);
    }
    if(this.#sortComponent){
      remove(this.#sortComponent);
    }
    if (resetSortType) {
      this.#currentSortType = SortVariants.DAY;
    }
  };

  #handleViewAction = (actionType, updateType, point) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, point);
        break;
      case UserAction.ADD_POINT:
        // console.log(point);
        this.#pointsModel.addPoint(updateType, point);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, point);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.INIT_DESTINATIONS:
        this.#destinations = [...this.#destinationsModel.destinations];
        this.#resourses.destinations = true;
        this.#checkResourses();
        break;
      case UpdateType.INIT_OFFERS:
        this.#offers = [...this.#offersModel.offers];
        this.#resourses.offers = true;
        this.#checkResourses();
        break;
      case UpdateType.INIT_POINTS:
        this.#resourses.points = true;
        this.#checkResourses();
        break;
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPoints();
        this.#renderPage();
        break;
      case UpdateType.MAJOR:
        this.#clearPoints({resetSortType: true});
        this.#renderPage();
        break;
    }
  };

  #checkResourses = () => {
    if(!this.#resourses.offers || !this.#resourses.destinations || !this.#resourses.points) {return;}
    this.#offers = [...this.#offersModel.offers];
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#isLoading = false;
    remove(this.#loadingComponent);
    if(!this.#offers.length || !this.#destinations.length){
      this.#renderErrorComponent();
    } else {
      this.#filterPresenter.init();
      this.#enableNewPointBtn();
      this.#renderPage();
    }
  };
}
