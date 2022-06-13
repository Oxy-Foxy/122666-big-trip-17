import PointsModel from './model/point-model';
import OffersModel from './model/offer-model';
import FilterModel from './model/filter-model.js';
import IndexPresenter from './presenter/index-presenter';
import FilterPresenter from './presenter/filter-presenter.js';

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const filterModel = new FilterModel();

const indexPresenter = new IndexPresenter(pointsModel, offersModel, filterModel);
const filterPresenter = new FilterPresenter(filterModel, pointsModel);

const newPointBtn = document.querySelector('.trip-main__event-add-btn');

const handleNewPointFormClose = () => {
  newPointBtn.disabled = false;
};

const handleNewPointButtonClick = () => {
  indexPresenter.createPoint(handleNewPointFormClose);
  newPointBtn.disabled = true;
};

newPointBtn.addEventListener('click', handleNewPointButtonClick);

indexPresenter.init();
filterPresenter.init();
