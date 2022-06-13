import AbstractView from '../framework/view/abstract-view';
const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return (
    `<div class="trip-filters__filter">
      <input
        id="filter-${type}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${type}"
        ${type === currentFilterType ? 'checked' : ''}
        ${count === 0 ? 'disabled' : ''}
      >
      <label
        class="trip-filters__filter-label"
        for="filter-${type}">
          ${name}
        </label>
    </div>`
  );
};
const createNewFiltersTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<form class="trip-filters" action="#" method="get">
            ${filterItemsTemplate}
            <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
};

export default class FiltersView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createNewFiltersTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  };

}
