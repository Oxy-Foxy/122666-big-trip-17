import {generatePoint} from '../mock/point';
import DestinationModel from './destination-model';
import OffersModel from './offer-model';

export default class PointsModel {
  destination = new DestinationModel().getDestination();
  offers = new OffersModel().getOffers();
  points = Array.from({length:3}, ()=>generatePoint(this.destination, this.offers));

  getPoints = ()=> this.points;
}
