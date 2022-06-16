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
  type:'',
  isNew: true
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
      this.#editFormRollupBtnClickHandler();
    });
    this.#newPointForm.setSubmitHandler((state)=>{
      this.#editFormSubmitHandler(state);
    });
    this.#newPointForm.setDeleteClickHandler(()=>{
      this.#deleteBtnClickHandler();
    });

    render(this.#listItem, this.#listComponent.element, 'afterbegin');
    render(this.#newPointForm, this.#listItem.element);

    document.addEventListener('keydown', this.#escKeyDownHandler);
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
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  setSaving = (point) => {
    this.#newPointForm.updateElement({
      point: {...point,
        isDisabled: true,
        isSaving: true,
        isNew: true
      }
    });
  };

  setAborting = (point) => {
    const resetFormState = () => {
      this.#newPointForm.updateElement({
        point: {
          ...point,
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
        }
      });
    };

    this.#newPointForm.shake(resetFormState);
  };

  #editFormSubmitHandler = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {...point},
    );
  };

  #deleteBtnClickHandler = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.destroy();
    }
  };

  #editFormRollupBtnClickHandler = () => {
    this.destroy();
  };
}
