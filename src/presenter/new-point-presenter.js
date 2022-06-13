import listItemView from '../view/list-item-view';
import FormUpdateView from '../view/form-update-view';
import {render, remove} from '../framework/render';
import {UserAction, UpdateType} from '../enums.js';

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

  init = (callback) => {
    if (this.#newPointForm !== null) {
      return;
    }

    this.#listItem = new listItemView();
    this.#newPointForm = new FormUpdateView();
    this.#destroyCallback = callback;

    this.#newPointForm.setClickHandler(()=>{
      this.#onEditFormRollupBtnClick();
    });
    this.#newPointForm.setSubmitHandler((update)=>{
      this.#onEditFormSubmit(update);
    });
    this.#newPointForm.setDeleteClickHandler((update)=>{
      this.#onDeleteClick(update);
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

  #onEditFormSubmit = (update) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: 1, ...update},
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
