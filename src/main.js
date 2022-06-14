import PointsModel from './model/point-model';
import OffersModel from './model/offer-model';
import DestinationsModel from './model/destination-model';
import IndexPresenter from './presenter/index-presenter';
import PointsApiService from './api/points.js';
import OffersApiService from './api/offers.js';
import DestinationsApiService from './api/destinations.js';

const AUTHORIZATION = 'Basic gyt78y57ytv7b56v';
const END_POINT = 'https://17.ecmascript.pages.academy/big-trip';

const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const offersModel = new OffersModel(new OffersApiService(END_POINT, AUTHORIZATION));
const destinationsModel = new DestinationsModel(new DestinationsApiService(END_POINT, AUTHORIZATION));

const indexPresenter = new IndexPresenter(pointsModel, offersModel, destinationsModel);


const newPointBtn = document.querySelector('.trip-main__event-add-btn');

const handleNewPointFormClose = () => {
  newPointBtn.disabled = false;
};

const handleNewPointButtonClick = () => {
  indexPresenter.createPoint();
  newPointBtn.disabled = true;
};

newPointBtn.addEventListener('click', handleNewPointButtonClick);

indexPresenter.init(handleNewPointFormClose);
offersModel.init();
destinationsModel.init();
pointsModel.init();
