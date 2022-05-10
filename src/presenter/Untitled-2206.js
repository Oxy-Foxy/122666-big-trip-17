import filtersView from '../view/filters-view';
import sortView from '../view/sort-view';
import listView from '../view/list-view';
import listItemView from '../view/list-item-view';
import pointView from '../view/point-view';
import formUpdateView from '../view/form-update-view';
import EmptyMessageView from '../view/empty-message-view';
import {render} from '../render';

const filtersContainer = document.querySelector('.trip-controls__filters');
const contentContainer = document.querySelector('.trip-events');

export default class IndexPresenter {
  #listComponent = null;
  #emptyMessageView = null;
  #filtersContainer = null;
  #contentContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #points = [];
  #offers = [];

  init = (pointsModel, offersModel) => {
    this.#listComponent = new listView();
    this.#filtersContainer = filtersContainer;
    this.#contentContainer = contentContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#points = [...this.#pointsModel.points];
    // this.#points = [];
    this.#offers = [...this.#offersModel.offers];
    render(new filtersView(), this.#filtersContainer);


    if(this.#points.length){
      render(new sortView(), this.#contentContainer);
      render(this.#listComponent, this.#contentContainer);
      for (let i = 0; i < this.#points.length; i++) {
        this.#renderPoint(this.#points[i]);
      }
    } else {
      this.#emptyMessageView = new EmptyMessageView();
      render(this.#emptyMessageView, this.#contentContainer);
    }

  };

  #renderPoint = (point)=> {
    const offersOfType = this.#offers.filter((offersItem) => offersItem.type === point.type)[0];
    const item = new listItemView();
    const editItem = new formUpdateView(point, offersOfType.offers);
    const pointElm = new pointView(point, offersOfType.offers);

    const replacePointToForm = () => {
      item.element.replaceChild(editItem.element, pointElm.element);
    };
    const replaceFormToPoint = () => {
      item.element.replaceChild(pointElm.element, editItem.element);
    };
    const onPointRollupBtnClick = () => {
      replacePointToForm();
    };
    const onEditFormRollupBtnClick = () => {
      replaceFormToPoint();
    };
    const onEscKeyDown = (evt)=> {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };
    const onEditFormSubmit = (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    };

    pointElm.element.querySelector('.event__rollup-btn').addEventListener('click', onPointRollupBtnClick);
    editItem.element.querySelector('.event__rollup-btn').addEventListener('click', onEditFormRollupBtnClick);
    document.addEventListener('keydown', onEscKeyDown);
    editItem.element.addEventListener('submit', onEditFormSubmit);

    render(item, this.#listComponent.element);
    render(pointElm, item.element);
  };
}
