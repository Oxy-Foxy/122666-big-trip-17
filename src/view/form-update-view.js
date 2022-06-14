import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {PointTypes} from '../enums';
import {getformDateTime, getSimpleDifference, toIsoString} from '../utils';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const getDestinationsOptions = (destinations)=>{
  const destinationsNames = destinations.map((destination) => destination.name);
  let result;

  destinationsNames.forEach((item)=>{
    result+=`<option value="${item}"></option>`;
  });
  return result;
};

const getTypesItems = (point)=>{
  let result='';
  PointTypes.forEach((type) => {
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
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-meal-${offer.id}" type="checkbox" name="event-offer-meal" ${checked}>
    <label class="event__offer-label" for="event-offer-meal-${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`;
  });
  return result;
};

const createNewFormUpdateTemplate = (state, destinations) => {
  const point = state.point;
  const filteredOffers = state.offers;
  const type = point.type;
  const typeIcon = type ? `"img/icons/${type}.png"`: 'img/icons/taxi.png';
  const typesItems = getTypesItems(point);
  const destinationName = point.destination ? point.destination.name : '';
  const price = point.basePrice;
  const description = point.destination ? point.destination.description : '';
  const startDateTime = getformDateTime(point.dateFrom);
  const endDateTime = getformDateTime(point.dateTo);
  const pointOffers = point.offers;
  const typeOffers = getTypeOffers(filteredOffers, pointOffers);
  const images = point.destination ? getImages(point.destination.pictures) : [];
  const destinationsItems = getDestinationsOptions(destinations);
  return `
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src=${typeIcon} alt="Event type icon">
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
          ${destinationsItems}
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

export default class FormUpdateView extends AbstractStatefulView {
  #offers = null;
  #filteredOffers = null;
  #destinations = null;
  #typeRadios = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor(point, offers, destinations){
    super();
    this.#destinations = destinations;
    this.#offers = offers;
    this.#filteredOffers = this.#filterOffers(point);
    this._state = FormUpdateView.parsePointToState(point, this.#filteredOffers);
    this.#typeRadios = Array.from(this.element.querySelectorAll('.event__type-input'));

    this.#setInnerHandlers();
    this.#setDateFromDatepicker();
    this.#setDateToDatepicker();
  }

  get template() {
    return createNewFormUpdateTemplate(this._state, this.#destinations);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  };

  setClickHandler = (callback)=>{
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  };

  setSubmitHandler = (callback)=>{
    this._callback.submit = callback;
    this.element.addEventListener('submit',this.#submitHandler);
  };

  setDeleteClickHandler = (callback)=>{
    this._callback.delete = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteHandler);
  };

  #clickHandler = (evt)=>{
    evt.preventDefault();
    this._callback.click();
  };

  #submitHandler = (evt)=>{
    evt.preventDefault();
    this._callback.submit(FormUpdateView.parseStateToPoint(this._state));
  };

  #deleteHandler = (evt)=>{
    evt.preventDefault();
    this._callback.delete(FormUpdateView.parseStateToPoint(this._state));
  };

  #typeChangeHandler = (evt)=>{
    evt.preventDefault();
    const typeRadioId = evt.target.getAttribute('for');
    const typeRadioInput = this.#typeRadios.filter((elm) => elm.id === typeRadioId)[0];
    if(!typeRadioInput) {return;}
    const type = typeRadioInput.value;
    this.updateElement({point: {...this._state.point, type}});
    this.#filteredOffers = this.#filterOffers(this._state.point, this.#offers);
    this.updateElement({offers: this.#filteredOffers});
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const newDestinationName = evt.target.value;
    const destination = this.#destinations.filter((item) => item.name === newDestinationName)[0];
    this.updateElement({point: {...this._state.point, destination}});
  };

  #priceInputHandler = (evt)=>{
    const newPrice = evt.target.value;
    if(!/^[0-9]+$/.test(newPrice) && newPrice !== ''){
      evt.target.value = '';
    }
  };

  #priceChangeHandler = (evt)=>{
    evt.preventDefault();
    const newPrice = evt.target.value;
    this.updateElement({point: {...this._state.point, basePrice:Number(newPrice)}});
  };

  #setInnerHandlers = ()=>{
    this.element.querySelector('.event__type-group').addEventListener('click', this.#typeChangeHandler);
    this.element.querySelector('#event-destination-1').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('#event-price-1').addEventListener('change', this.#priceChangeHandler);
    this.element.querySelector('#event-price-1').addEventListener('input', this.#priceInputHandler);
  };

  #setDateFromDatepicker = () => {
    if (this._state.point.dateFrom) {
      this.#datepickerFrom = flatpickr(
        this.element.querySelector('#event-start-time-1'),
        {
          dateFormat: 'j/m/Y H:i',
          enableTime: true,
          'time_24hr': true,
          defaultDate: toIsoString(this._state.point.dateFrom),
          onClose: this.#dateFromChangeHandler,
          minDate: 'today'
        },
      );
    }
  };

  #setDateToDatepicker = () => {
    if (this._state.point.dateTo) {
      const defaultDate = this.#getDefaultDateTo();
      this.#datepickerTo = flatpickr(
        this.element.querySelector('#event-end-time-1'),
        {
          dateFormat: 'j/m/Y H:i',
          enableTime: true,
          'time_24hr': true,
          defaultDate,
          onClose: this.#dateToChangeHandler,
          minDate: toIsoString(this._state.point.dateFrom)
        },
      );
    }
  };

  #getDefaultDateTo = ()=> {
    const date1 = this._state.point.dateFrom instanceof Date ? this._state.point.dateFrom.toISOString() : toIsoString(this._state.point.dateFrom);
    const date2 = toIsoString(this._state.point.dateTo);
    return getSimpleDifference(date1, date2) > 0 ? toIsoString(this._state.point.dateFrom) : toIsoString(this._state.point.dateTo);
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({point:{
      ...this._state.point,
      dateFrom: userDate,
    }});
    this.#datepickerTo.destroy();
    this.#datepickerTo = null;
    this.#setDateToDatepicker();
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({point: {
      ...this._state.point,
      dateTo: userDate,
    }});

  };

  _restoreHandlers = ()=>{
    this.#setInnerHandlers();
    this.setSubmitHandler(this._callback.submit);
    this.setClickHandler(this._callback.click);
    this.setDeleteClickHandler(this._callback.delete);
    this.#setDateFromDatepicker();
    this.#setDateToDatepicker();
  };

  reset = (point, offers)=>{
    this.updateElement(FormUpdateView.parsePointToState(point, offers));
  };

  static parsePointToState = (point, offers) => ({point: {...point}, offers: [...offers]});
  static parseStateToPoint = (state)=>{
    const point = {...state};
    return point;
  };

  #filterOffers = (point) => point.type ? this.#offers.filter((offersItem) => offersItem.type === point.type)[0].offers : [];
}
