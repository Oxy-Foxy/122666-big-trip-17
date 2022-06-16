import Observable from '../framework/observable.js';
import { UpdateType } from '../enums.js';

export default class OffersModel extends Observable{
  #offersApiService = null;
  #offers = [];

  constructor (OffersApiService){
    super();
    this.#offersApiService = OffersApiService;
  }

  get offers(){
    return this.#offers;
  }

  init = async () => {
    try {
      this.#offers = await this.#offersApiService.offers;
    } catch(err) {
      this.#offers = [];
    }
    this._notify(UpdateType.INIT_OFFERS);
  };
}
