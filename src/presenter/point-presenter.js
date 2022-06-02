import listItemView from '../view/list-item-view';
import pointView from '../view/point-view';
import formUpdateView from '../view/form-update-view';
import DestinationModel from '../model/destination-model';
import {render, replace, remove} from '../framework/render';


const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

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

  init = (point, offers) => {
    this.#point = point;
    this.#destinations = new DestinationModel().getDestination();
    this.#point.destination = this.#destinations.filter((item) => item.name === this.#point.destination)[0];
    this.#offers = offers;
    this.#filteredOffers = this.#filterOffers(this.#point, offers);
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
    this.#editItem.setSubmitHandler(()=>{
      this.#onEditFormSubmit();
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
    this.#hideForm();
  };

  #onEditFormSubmit = () => {
    this.#hideFormHandler();
  };

  #onEscKeyDown = (evt)=> {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.#editItem.reset(this.#point, this.#filteredOffers);
      this.#hideFormHandler();
    }
  };

  #hideFormHandler(){
    this.#hideForm();
    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  destroy = () => {
    remove(this.#listItem);
    remove(this.#pointElm);
    remove(this.#editItem);
  };

  resetView = () => {
    console.log('reset view', this.#mode);
    if (this.#mode !== Mode.DEFAULT) {
      this.#editItem.reset(this.#point, this.#filteredOffers);
      this.#hideFormHandler();
    }
  };

  #handleFavoriteClick = ()=> {
    this.#changeData({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #filterOffers = (point, offers) => offers.filter((offersItem) => offersItem.type === point.type)[0].offers;
}
