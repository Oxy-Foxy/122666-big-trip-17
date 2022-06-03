import {generatePoint} from '../mock/point';

export default class PointsModel {
  #points = Array.from(['Chamonix','Amsterdam','Geneva'], (index)=>generatePoint(index));

  get points(){
    return this.#points;
  }
}
