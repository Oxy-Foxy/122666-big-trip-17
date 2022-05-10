import {createElement} from '../render';
import {getShortDate, getDate, getTime, getDifference} from '../utils';

const getOffersItems = (offers, pointOffers)=>{
  let result = '';
  offers.forEach((offer) => {
    if(pointOffers.includes(offer.id)) {
      result += `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`;
    }
  });
  return result;
};

const createNewPointTemplate = (point, filteredOffers) => {
  const type = point.type;
  const price = point.basePrice;
  const btnClassActive = point.isFavorite ? 'event__favorite-btn--active' : '';
  const pointOffers = point.offers;
  const offers = getOffersItems(filteredOffers, pointOffers);
  const shortDate = getShortDate(point.dateFrom);
  const date = getDate(point.dateFrom);
  const startTime = getTime(point.dateFrom);
  const endTime = getTime(point.dateTo);
  const startDateTime = point.dateFrom;
  const endDateTime = point.dateTo;
  const duration = getDifference(point.dateFrom, point.dateTo);

  return `
  <div class="event">
    <time class="event__date" datetime="${date}">${shortDate}</time>

    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>

    <h3 class="event__title">${point.destination.name}</h3>

    <div class="event__schedule">

      <p class="event__time">
        <time class="event__start-time" datetime="${startDateTime}">${startTime}</time>
        &mdash;
        <time class="event__end-time" datetime="${endDateTime}">${endTime}</time>
      </p>

      <p class="event__duration">${duration}</p>
    </div>

    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${price}</span>
    </p>

    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">${offers}</ul>

    <button class="event__favorite-btn ${btnClassActive}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>`;
};

export default class PointView {
  #point = null;
  #offers = null;
  #element = null;
  constructor(point, offers){
    this.#point = point;
    this.#offers = offers;
  }

  get template() {
    return createNewPointTemplate(this.#point, this.#offers);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
