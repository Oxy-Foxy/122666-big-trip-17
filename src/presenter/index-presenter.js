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
  #filtersContainer = null;
  #contentContainer = null;
  #pointsModel = null;
  #emptyMessageElm = null;
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
    this.#offers = [...this.#offersModel.offers];
    render(new filtersView(), this.#filtersContainer);
    if(this.#points.length){
      render(new sortView(), this.#contentContainer);
      render(this.#listComponent, this.#contentContainer);

      for (let i = 0; i < this.#points.length; i++) {
        this.#renderPoint(this.#points[i]);
      }
    } else {
      this.#emptyMessageElm = new EmptyMessageView();
      render(this.#emptyMessageElm, this.#contentContainer);
    }
  };

  #renderPoint = (point)=> {
    const offersOfType = this.#offers.filter((offersItem) => offersItem.type === point.type)[0];
    const item = new listItemView();
    const editItem = new formUpdateView(point, offersOfType.offers);
    const pointElm = new pointView(point, offersOfType.offers);

    const showForm = () => {
      item.element.replaceChild(editItem.element, pointElm.element);
      document.addEventListener('keydown', onEscKeyDown);
    };
    const hideForm = () => {
      item.element.replaceChild(pointElm.element, editItem.element);
    };
    const onPointRollupBtnClick = () => {
      showForm();
    };
    const onEditFormRollupBtnClick = () => {
      hideForm();
    };

    const onEditFormSubmit = (evt) => {
      hideFormHandler(evt);
    };

    function onEscKeyDown(evt) {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        hideFormHandler(evt);
      }
    }

    function hideFormHandler(evt){
      evt.preventDefault();
      hideForm();
      document.removeEventListener('keydown', onEscKeyDown);
    }


    pointElm.element.querySelector('.event__rollup-btn').addEventListener('click', onPointRollupBtnClick);
    editItem.element.querySelector('.event__rollup-btn').addEventListener('click', onEditFormRollupBtnClick);
    editItem.element.addEventListener('submit', onEditFormSubmit);

    render(item, this.#listComponent.element);
    render(pointElm, item.element);
  };
}
