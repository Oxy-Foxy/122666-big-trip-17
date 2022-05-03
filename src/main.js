import IndexPresenter from './presenter/index-presenter';
import PointsModel from './model/point-model';
import OffersModel from './model/offer-model';
const pointsModel = new PointsModel();
const offersModel = new OffersModel();

const indexPresenter = new IndexPresenter();
indexPresenter.init(pointsModel, offersModel);
