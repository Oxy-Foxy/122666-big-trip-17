import AbstractView from '../framework/view/abstract-view';
import {getformDateTime} from '../utils';
import { getTypes } from '../mock/types';


const getTypesItems = (point)=>{
  const offerTypes = getTypes();
  let result='';
  offerTypes.forEach((type) => {
    const checked = type === point.type ? 'checked' : '';
    result += `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${checked}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
  </div>`;
  });
  return result;
};
const getImages = (pictures)=>{
  if(pictures.length){
    let images = '';
    pictures.forEach((picture) => {
      images += `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
    });
    return `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${images}
    </div>
  </div>`;
  }
};
const getTypeOffers = (offers, pointOffers)=>{
  let result = '';

  offers.forEach((offer) => {
    const checked = pointOffers.includes(offer.id) ? 'checked': '';
    result += `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-meal-1" type="checkbox" name="event-offer-meal" ${checked}>
    <label class="event__offer-label" for="event-offer-meal-1">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`;
  });
  return result;
};

const createNewFormUpdateTemplate = (point, filteredOffers) => {
  const type = point.type;
  const typesItems = getTypesItems(point);
  const destinationName = point.destination.name;
  const price = point.basePrice;
  const description = point.destination.description;
  const startDateTime = getformDateTime(point.dateFrom);
  const endDateTime = getformDateTime(point.dateTo);
  const pointOffers = point.offers;
  const typeOffers = getTypeOffers(filteredOffers, pointOffers);
  const images = getImages(point.destination.pictures);
  return `
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>

            ${typesItems}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationName}" list="destination-list-1">
        <datalist id="destination-list-1">
          <option value="Amsterdam"></option>
          <option value="Geneva"></option>
          <option value="Chamonix"></option>
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDateTime}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDateTime}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${typeOffers}
        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
        ${images}
      </section>
    </section>
  </form>`;
};

export default class FormUpdateView extends AbstractView {
  #point = null;
  #offers = null;
  constructor(point, offers){
    super();
    this.#point = point;
    this.#offers = offers;
  }

  get template() {
    return createNewFormUpdateTemplate(this.#point, this.#offers);
  }

  setClickHandler = (callback)=>{
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  };

  setSubmitHandler = (callback)=>{
    this._callback.submit = callback;
    this.element.addEventListener('submit',this.#submitHandler);
  };

  #clickHandler = (evt)=>{
    evt.preventDefault();
    this._callback.click();
  };

  #submitHandler = (evt)=>{
    evt.preventDefault();
    this._callback.submit();
  };
}
