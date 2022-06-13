import listItemView from '../view/list-item-view';
import pointView from '../view/point-view';
import formUpdateView from '../view/form-update-view';
import DestinationModel from '../model/destination-model';
import {generateOffers} from '../mock/offer';
import {render, replace, remove} from '../framework/render';
import {UserAction, UpdateType, Mode} from '../enums.js';
import {isPast, isFuture} from '../utils.js';

export default class PointPresenter {
  #point = null;
  #destinations = null;
  #offers= null;
  #filteredOffers = null;
  #listComponent = null;
  #listItem = null;
  #editItem = null;
  #pointElm = null;
  #changeData = null;
  #changeMode = null;
  #mode = Mode.DEFAULT;

  constructor(listComponent, changeData, changeMode) {
    this.#listComponent = listComponent;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point) => {
    this.#point = point;
    this.#destinations = new DestinationModel().getDestination();
    this.#point.destination = typeof this.#point.destination === 'string' ? this.#destinations.filter((item) => item.name === this.#point.destination)[0] : this.#point.destination;
    this.#offers = generateOffers();
    this.#filteredOffers = this.#filterOffers(this.#point);
    const prevPointElm = this.#pointElm;
    const prevEditItem = this.#editItem;
    this.#listItem = new listItemView();
    this.#editItem = new formUpdateView(this.#point, this.#offers, this.#destinations);
    this.#pointElm = new pointView(this.#point, this.#filteredOffers);

    this.#pointElm.setClickHandler(()=>{
      this.#onPointRollupBtnClick();
    });

    this.#editItem.setClickHandler(()=>{
      this.#onEditFormRollupBtnClick();
    });
    this.#editItem.setSubmitHandler((update)=>{
      this.#onEditFormSubmit(update);
    });
    this.#editItem.setDeleteClickHandler((update)=>{
      this.#onDeleteClick(update);
    });
    this.#pointElm.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevPointElm === null || prevEditItem === null) {
      render(this.#listItem, this.#listComponent.element);
      render(this.#pointElm, this.#listItem.element);
      return;
    }
    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointElm, prevPointElm);
    }
    if (this.#mode === Mode.EDITING) {
      replace(this.#editItem, prevEditItem);
    }

    remove(prevPointElm);
    remove(prevEditItem);
  };

  #showForm = () => {
    replace(this.#editItem, this.#pointElm);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #hideForm = () => {
    replace(this.#pointElm, this.#editItem);
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
  };

  #onPointRollupBtnClick = () => {
    this.#showForm();
  };

  #onEditFormRollupBtnClick = () => {
    this.#hideFormHandler();
  };

  #onEditFormSubmit = (update) => {
    const isMinorUpdate = isPast(this.#point.dateTo) === isPast(update.point.dateTo) && isFuture(this.#point.dateFrom) === isFuture(update.point.dateFrom);
    this.#changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
    this.#hideFormHandler();
  };

  #onDeleteClick = (update) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      update.point,
    );
  };

  #onEscKeyDown = (evt)=> {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.#hideFormHandler();
    }
  };

  #hideFormHandler(){
    this.#editItem.reset(this.#point, this.#filteredOffers);
    this.#hideForm();
    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  destroy = () => {
    remove(this.#listItem);
    remove(this.#pointElm);
    remove(this.#editItem);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#editItem.reset(this.#point, this.#filteredOffers);
      this.#hideFormHandler();
    }
  };

  #handleFavoriteClick = ()=> {
    this.#changeData({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #filterOffers = (point) => this.#offers.filter((offersItem) => offersItem.type === point.type)[0].offers;
}
