import {generatePoint} from '../mock/point';
import DestinationModel from './destination-model';

export default class PointsModel {
  destination = new DestinationModel().getDestination();
  #points = Array.from({length:4}, ()=>generatePoint(this.destination));

  // getPoints = ()=> this.points;
  get points(){
    return this.#points;
  }
}
