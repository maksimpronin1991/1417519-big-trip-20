import AbstractView from '../framework/view/abstract-view.js';
import { humanizePointDateTime,humanizePointDateDayMonts } from '../utils/point.js';
import { getPointDuration } from '../utils/point.js';

function createTripEventsItemTemplate(tripPoint,tripOffer,tripDestination) {
  const {basePrice, dateFrom, dateTo, destination, isFavorite, type, offers} = tripPoint;
console.log(tripOffer)
  const allOffersThisType = tripOffer.find((objOffers) => objOffers.type === type).offers;

  const destinationObj = tripDestination.find((dstn)=>dstn.id === destination);

  const dateMontsDay = humanizePointDateDayMonts(dateFrom);
  const dateStart = humanizePointDateTime(dateFrom);
  const dateEnd = humanizePointDateTime(dateTo);


  function isFavoriteTrue (bolean){
    return bolean ? 'event__favorite-btn--active' : '';
  }
  const getOffersList = () => {
    const offersList = [];
    for (let i = 0; i < offers.length; i++){
      const offer = `
        <li class="event__offer">
        <span class="event__offer-title">${allOffersThisType[i].title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${allOffersThisType[i].price}</span>
      </li>`;
      offersList.push(offer);
    }
    return offersList.join('');
  };

  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="2019-03-18">${dateMontsDay}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${destinationObj.name}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="2019-03-18T10:30">${dateStart}</time>
        &mdash;
        <time class="event__end-time" datetime="2019-03-18T11:00">${dateEnd}</time>
      </p>
      <p class="event__duration">${getPointDuration(dateFrom,dateTo)}M</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
       ${getOffersList()}
    </ul>
    <button class="event__favorite-btn ${isFavoriteTrue(isFavorite)}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
}

export default class TripEventItem extends AbstractView{
  #point = null;
  #offer = null;
  #destination = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({point,offer,destination, onEditClick,onFavoriteClick}){
    super();
    this.#point = point;
    this.#offer = offer;
    this.#destination = destination;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;
    this.element.querySelector('.event__favorite-icon')
      .addEventListener('click', this.#favoriteClickHandler);
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click',this.#editClickHandler);
  }

  get template() {
    return createTripEventsItemTemplate(this.#point, this.#offer.offers, this.#destination.destinations);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick(this.#point);
  };
}
