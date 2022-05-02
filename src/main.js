import IndexPresenter from './presenter/index-presenter';
import PointsModel from './model/point-model';
const pointsModel = new PointsModel();

const indexPresenter = new IndexPresenter();
indexPresenter.init(pointsModel);
