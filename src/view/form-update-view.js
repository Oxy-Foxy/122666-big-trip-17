import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {PointTypes} from '../enums';
import {getformDateTime, getSimpleDifference, toIsoString} from '../utils';

const getDestinationsOptions = (destinations) => {
  const destinationsNames = destinations.map((destination) => destination.name);
  let result;

  destinationsNames.forEach((item)=>{
    result+=`<option value="${item}"></option>`;
  });

  return result;
};

const getTypesItems = (point) => {
  let result = '';

  PointTypes.forEach((type) => {
    const checked = type === point.type ? 'checked' : '';
    result += `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${checked}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
  </div>`;
  });
  return result;
};

const getImages = (pictures) => {
  if(!pictures.length) {return '';}

  let images = '';
  pictures.forEach((picture) => {
    images += `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
  });

  return `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${images}
    </div>
  </div>`;
};

const getTypeOffers = (offers, pointOffers) => {
  let result = '';

  offers.forEach((offer) => {
    const checked = pointOffers.includes(offer.id) ? 'checked': '';
    result += `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer" ${checked}>
    <label class="event__offer-label" for="event-offer-${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`;
  });

  return result;
};

const getOffersSection = (typeOffers) => {
  const hiddenClass = typeOffers === '' ? 'visually-hidden' : '';

  return `<section class="event__section  event__section--offers ${hiddenClass}">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${typeOffers}
    </div>
  </section>`;
};

const getDestinationsSection = (description, images)=>{
  const hiddenClass = description === '' && images === '' ? 'visually-hidden' : '';

  return `<section class="event__section  event__section--destination ${hiddenClass}">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>
    ${images}
  </section>`;
};

const getSaveButton = (point) => {
  const text = point.isSaving ? 'Saving...' : 'Save';
  const disabled = point.isDisabled ? 'disabled' : '';

  return `<button class="event__save-btn  btn  btn--blue" type="submit" ${disabled}>${text}</button>`;
};

const getDeleteButton = (point) => {
  const disabled = point.isDisabled ? 'disabled' : '';
  let text = '';
  if(point.isNew && !point.isDeleting){
    text = 'Cancel';
  } else if(!point.isNew && point.isDeleting) {
    text = 'Deleting...';
  } else {
    text = 'Delete';
  }

  return `<button  class="event__reset-btn" type="reset" ${disabled}>${text}</button>`;
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
  const images = point.destination ? getImages(point.destination.pictures) : '';
  const destinationsItems = getDestinationsOptions(destinations);

  return `
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src=${typeIcon} alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${point.isDisabled ? 'disabled' : ''}>
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
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationName}" list="destination-list-1" ${point.isDisabled ? 'disabled' : ''} required>
        <datalist id="destination-list-1">
          ${destinationsItems}
        </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDateTime}" ${point.isDisabled ? 'disabled' : ''}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDateTime}" ${point.isDisabled ? 'disabled' : ''}>
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}" ${point.isDisabled ? 'disabled' : ''} required min="1" />
      </div>
      ${getSaveButton(point)}
      ${getDeleteButton(point)}
      <button class="event__rollup-btn" type="button" ${point.isDisabled ? 'disabled' : ''}>
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      ${getOffersSection(typeOffers)}
      ${getDestinationsSection(description, images)}
    </section>
  </form>`;
};

export default class FormUpdateView extends AbstractStatefulView {
  #offers = null;
  #filteredOffers = null;
  #destinations = null;
  #typeRadios = null;
  #offersInputs = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #offersSection = null;

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

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  };

  setSubmitHandler = (callback) => {
    this._callback.submit = callback;
    this.element.addEventListener('submit', this.#submitHandler);
  };

  setDeleteClickHandler = (callback) => {
    this._callback.delete = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteHandler);
  };

  reset = (point, offers) => {
    this.updateElement(FormUpdateView.parsePointToState(point, offers));
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setSubmitHandler(this._callback.submit);
    this.setClickHandler(this._callback.click);
    this.setDeleteClickHandler(this._callback.delete);
    this.#setDateFromDatepicker();
    this.#setDateToDatepicker();
  };

  #filterOffers = (point) => point.type ? this.#offers.filter((offersItem) => offersItem.type === point.type)[0].offers : [];

  #setInnerHandlers = ()=>{
    this.#offersSection = this.element.querySelector('.event__available-offers');
    this.#offersSection.addEventListener('click', this.#offersChangeHandler);
    this.element.querySelector('.event__type-group').addEventListener('click',  this.#typeChangeHandler);
    this.element.querySelector('#event-destination-1').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('#event-price-1').addEventListener('change', this.#priceChangeHandler);
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
        },
      );
    }
  };

  #setDateToDatepicker = () => {
    if (this._state.point.dateTo) {
      this.#datepickerTo = flatpickr(
        this.element.querySelector('#event-end-time-1'),
        {
          dateFormat: 'j/m/Y H:i',
          enableTime: true,
          'time_24hr': true,
          defaultDate:toIsoString(this._state.point.dateTo),
          onClose: this.#dateToChangeHandler,
          minDate: toIsoString(this._state.point.dateFrom)
        },
      );
    }
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #submitHandler = (evt) => {
    evt.preventDefault();
    this._callback.submit(FormUpdateView.parseStateToPoint(this._state));
  };

  #deleteHandler = (evt) => {
    evt.preventDefault();
    this._callback.delete(FormUpdateView.parseStateToPoint(this._state));
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    const typeRadioId = evt.target.getAttribute('for');
    const typeRadioInput = this.#typeRadios.filter((elm) => elm.id === typeRadioId)[0];
    if(!typeRadioInput) {return;}
    const type = typeRadioInput.value;
    const offersElements = Array.from(document.querySelectorAll('.event__offer-checkbox'));
    for (const element of offersElements) {
      element.removeAttribute('checked');
    }
    this.updateElement({point: {...this._state.point, type, offers:[]}});
    this.#filteredOffers = this.#filterOffers(this._state.point, this.#offers);
    this.updateElement({offers: this.#filteredOffers});
  };

  #offersChangeHandler = (evt) => {
    if(evt.target.tagName === 'INPUT'){
      this.#offersInputs = Array.from(this.#offersSection.querySelectorAll('[name="event-offer"]'));
      const selectedOffersInputs = this.#offersInputs.filter((input) => input.checked);
      const selectedOffersIds = selectedOffersInputs.map((offer) => Number(offer.id.replace('event-offer-', '')));
      this.updateElement({point: {...this._state.point, offers:selectedOffersIds}});
      const selectedOffers = this.#filterOffers(this._state.point, this.#offers);
      this.updateElement({offers: selectedOffers});
      this.#filteredOffers = this.#filterOffers(this._state.point, this.#offers);
    }
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const newDestinationName = evt.target.value;
    const destination = this.#destinations.filter((item) => item.name === newDestinationName)[0];
    this.updateElement({point: {...this._state.point, destination}});
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    const newPrice = evt.target.value;
    this.updateElement({point: {...this._state.point, basePrice: Math.abs(Number(newPrice))}});
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({point:{
      ...this._state.point,
      dateFrom: userDate,
    }});
    this.#datepickerTo.destroy();
    this.#datepickerTo = null;
    this.#setDateToDatepicker();
    if(getSimpleDifference(userDate, this._state.point.dateTo) < 0) {return;}
    this.updateElement({point: {
      ...this._state.point,
      dateTo: userDate,
    }});
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({point: {
      ...this._state.point,
      dateTo: userDate,
    }});
  };

  static parsePointToState = (point, offers) => ({point: {...point, isDisabled:false, isSaving:false, isDeleting:false}, offers: [...offers]});

  static parseStateToPoint = (state) => {
    const point = {...state.point};
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    if(point.isNew) {delete point.isNew;}
    return point;
  };
}
