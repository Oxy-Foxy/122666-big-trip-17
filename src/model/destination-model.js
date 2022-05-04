import {generateDestination} from './../mock/destination';

export default class DestinationModel {
  destination = generateDestination();
  getDestination = ()=> this.destination;
}
