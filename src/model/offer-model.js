import {generateOffers} from '../mock/offer';

export default class OffersModel {
  #offers = generateOffers();
  get offers(){
    return this.#offers;
  }
}
