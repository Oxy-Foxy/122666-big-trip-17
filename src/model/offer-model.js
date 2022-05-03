import {generateOffers} from '../mock/offer';

export default class OffersModel {
  offers = generateOffers();
  getOffers = ()=> this.offers;
}
