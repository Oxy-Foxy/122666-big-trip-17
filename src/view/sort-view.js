import AbstractView from '../framework/view/abstract-view';
import { SortTypes } from '../enums';

const getSortItems = () => {
  let result = '';
  SortTypes.forEach((item) => {
    const dataSortBy = item.sortBy ? `data-sort-type="${item.sortBy}"` : '';
    result += `<div class="trip-sort__item  trip-sort__item--${item.type}"> <input id="sort-${item.type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${item.type}" ${item.checked ? 'checked' : ''} ${item.disabled ? 'disabled' : ''}>
    <label class="trip-sort__btn" for="sort-${item.type}" ${dataSortBy}>${item.name}</label>
  </div>`;
  });
  return result;
};

const createNewSortTemplate = () => {
  const sortItems = getSortItems();
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">${sortItems}</form>`;
};

export default class SortView extends AbstractView {
  get template() {
    return createNewSortTemplate();
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    const dataSortType = evt.target.dataset.sortType;
    if (!dataSortType) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(dataSortType);
  };
}
