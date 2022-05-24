import {generatePoint} from '../mock/point';
import DestinationModel from './destination-model';

export default class PointsModel {
  destination = new DestinationModel().getDestination();
  #points = Array.from(['point_0','point_1','point_2','point_3'], (index)=>generatePoint(this.destination, index));

  get points(){
    return this.#points;
  }
}
