import { getTypes } from '../mock/types';
import {generateOffer} from '../mock/offer';
const offerTypes = getTypes();

export default class OffersModel {
  offers = Array.from(offerTypes, (type)=>generateOffer(type));
  getOffers = ()=> this.offers;
}
