import listItemView from '../view/list-item-view';
import FormUpdateView from '../view/form-update-view';
import {render, remove} from '../framework/render';
import {UserAction, UpdateType} from '../enums.js';
import {getformDateTime} from '../utils';

const BLANK_POINT = {
  basePrice: 0,
  dateFrom: getformDateTime(),
  dateTo: getformDateTime(),
  destination:null,
  isFavorite: false,
  offers:[],
  type:''
};

export default class PointPresenter {
  #listComponent = null;
  #listItem = null;
  #newPointForm = null;
  #changeData = null;
  #destroyCallback = null;

  constructor(listComponent, changeData) {
    this.#listComponent = listComponent;
    this.#changeData = changeData;
  }

  init = (callback,offers,destinations) => {
    if (this.#newPointForm !== null) {
      return;
    }

    this.#listItem = new listItemView();
    this.#newPointForm = new FormUpdateView(BLANK_POINT,offers,destinations);
    this.#destroyCallback = callback;

    this.#newPointForm.setClickHandler(()=>{
      this.#onEditFormRollupBtnClick();
    });
    this.#newPointForm.setSubmitHandler((state)=>{
      this.#onEditFormSubmit(state.point);
    });
    this.#newPointForm.setDeleteClickHandler(()=>{
      this.#onDeleteClick();
    });

    render(this.#listItem, this.#listComponent.element, 'afterbegin');
    render(this.#newPointForm, this.#listItem.element);

    document.addEventListener('keydown', this.#onEscKeyDown);

  };

  destroy = () => {
    if (this.#newPointForm === null) {
      return;
    }


    this.#destroyCallback?.();
    remove(this.#newPointForm);
    remove(this.#listItem);
    this.#newPointForm = null;
    this.#listItem = null;
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #onEditFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {...point},
    );
    this.destroy();
  };

  #onDeleteClick = () => {
    this.destroy();
  };

  #onEscKeyDown = (evt)=> {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.destroy();
    }
  };

  #onEditFormRollupBtnClick = () => {
    this.destroy();
  };
}
