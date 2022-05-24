import listItemView from '../view/list-item-view';
import pointView from '../view/point-view';
import formUpdateView from '../view/form-update-view';
import {render, replace, remove} from '../framework/render';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #point = null;
  #offers= null;
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
    this.#offers = offers;
    const prevPointElm = this.#pointElm;
    const prevEditItem = this.#editItem;
    this.#listItem = new listItemView();
    this.#editItem = new formUpdateView(this.#point, this.#offers);
    this.#pointElm = new pointView(this.#point, this.#offers);

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
    this.#listItem.element.replaceChild(this.#editItem.element, this.#pointElm.element);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #hideForm = () => {
    this.#listItem.element.replaceChild(this.#pointElm.element, this.#editItem.element);
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
    if (this.#mode !== Mode.DEFAULT) {
      this.#hideForm();
    }
  };

  #handleFavoriteClick = ()=> {
    this.#changeData({...this.#point, isFavorite: !this.#point.isFavorite});
  };
}
