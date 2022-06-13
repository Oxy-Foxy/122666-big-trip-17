import AbstractView from '../framework/view/abstract-view.js';

const createErrorTemplate = () => (
  '<p class="trip-events__msg">Seems that something is wrong on our side, reload page or try again later</p>'
);

export default class ErrorView extends AbstractView {
  get template() {
    return createErrorTemplate();
  }
}
