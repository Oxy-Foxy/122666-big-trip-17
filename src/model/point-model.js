import {generatePoint} from '../mock/point';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #points = Array.from(['Chamonix','Amsterdam','Geneva'], (index)=>generatePoint(index));

  get points(){
    return this.#points;
  }

  updatePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.point.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update.point,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update.point);
  };

  addPoint = (updateType, update) => {
    this.#points = [
      update.point,
      ...this.#points,
    ];

    this._notify(updateType, update.point);
  };

  deletePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  };
}
