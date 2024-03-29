import listItemView from '../view/list-item-view';
import pointView from '../view/point-view';
import formUpdateView from '../view/form-update-view';
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

  init = (point, offers, destinations) => {
    this.#point = point;
    this.#destinations = destinations;
    this.#point.destination = typeof this.#point.destination === 'string' ? this.#destinations.filter((item) => item.name === this.#point.destination)[0] : this.#point.destination;
    this.#offers = offers;
    this.#filteredOffers = this.#filterOffers(this.#point);
    const prevPointElm = this.#pointElm;
    const prevEditItem = this.#editItem;
    this.#listItem = new listItemView();
    this.#editItem = new formUpdateView(this.#point, this.#offers, this.#destinations);
    this.#pointElm = new pointView(this.#point, this.#filteredOffers);

    this.#pointElm.setClickHandler(() => {
      this.#pointRollupBtnClickHandler();
    });

    this.#editItem.setClickHandler(() => {
      this.#editFormRollupBtnClickHandler();
    });
    this.#editItem.setSubmitHandler((state) => {
      this.#editFormSubmitHandler(state);
    });
    this.#editItem.setDeleteClickHandler((state) => {
      this.#deleteBtnClickHandler(state);
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

  setSaving = (point) => {
    if (this.#mode === Mode.EDITING) {
      this.#editItem.updateElement({
        point: {...point,
          isDisabled: true,
          isSaving: true,
        }
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#editItem.updateElement({
        point: {...this.#point,
          isDisabled: true,
          isDeleting: true,
        }
      });
    }
  };

  setAborting = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#editItem.shake();
      return;
    }

    const resetFormState = () => {
      this.#editItem.updateElement({
        point: {
          ...this.#point,
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
        }
      });
    };

    this.#editItem.shake(resetFormState);
  };

  #showForm = () => {
    replace(this.#editItem, this.#pointElm);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #hideForm = () => {
    replace(this.#pointElm, this.#editItem);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #filterOffers = (point) => this.#offers.filter((offersItem) => offersItem.type === point.type)[0].offers;

  #pointRollupBtnClickHandler = () => {
    this.#showForm();
  };

  #editFormRollupBtnClickHandler = () => {
    this.#hideFormHandler();
  };

  #editFormSubmitHandler = (point) => {
    const isMinorUpdate = isPast(this.#point.dateTo) === isPast(point.dateTo) && isFuture(this.#point.dateFrom) === isFuture(point.dateFrom);

    this.#changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      point,
    );
  };

  #deleteBtnClickHandler = (point) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.#hideFormHandler();
    }
  };

  #hideFormHandler = () => {
    this.#editItem.reset(this.#point, this.#filteredOffers);
    this.#hideForm();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite},
    );
  };
}
