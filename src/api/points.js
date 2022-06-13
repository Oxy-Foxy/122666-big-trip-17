import ApiService from './../framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  createPoint = async (payload) => {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(payload.point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  updatePoint = async (payload) => {
    const response = await this._load({
      url: `points/${payload.point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(payload.point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  };

  deletePoint = async (payload) => {
    const response = await this._load({
      url: `points/${payload.id}`,
      method: Method.DELETE,
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return response;
  };

  #adaptToServer = (point)=>{
    const adaptedPoint = {...point,
      'base_price': point.basePrice,
      'date_from': point.dateFrom,
      'date_to': point.dateTo,
      'is_favorite': point.isFavorite,
      'offers':point.offers
    };
    delete adaptedPoint['basePrice'];
    delete adaptedPoint['dateFrom'];
    delete adaptedPoint['dateTo'];
    delete adaptedPoint['isFavorite'];

    return adaptedPoint;
  };
}
