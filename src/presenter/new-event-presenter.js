import EditEventView from '../view/edit-event-view';
import {remove, render, replace} from '../framework/render';
import {UpdateType, UserAction} from '../utils/const';
import {RenderPosition} from '../framework/render';
import {nanoid} from 'nanoid';
import {EditMode} from '../utils/const';

const defualtEvent = {
  totalPrice: '',
  fromDate: new Date(),
  toDate: new Date(),
  destination: {
    name: 'Moscow',
  },
  id: '',
  isFavorite: null,
  offers: [],
  type: 'bus',
};

export default class NewEventPresenter {
  #newEventContainer = null;
  #newEventComponent = null;
  #changeDataFunc = null;
  #destroyCallback = null;
  #changeEventTypeFunc = null;

  constructor(newEventContainer, changeDataFunc, changeEventTypeFunc) {
    this.#newEventContainer = newEventContainer;
    this.#changeDataFunc = changeDataFunc;
    this.#changeEventTypeFunc = changeEventTypeFunc;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    const prevNewEventComponent = this.#newEventComponent;

    this.#newEventComponent = new EditEventView({...defualtEvent, offers: this.#changeEventTypeFunc(defualtEvent.type)}, EditMode.NEW);

    this.#newEventComponent.setUpdateEventHandler(this.#addNewEventHandler);
    this.#newEventComponent.setCloseEditFormHandler(this.#closeEditFormHandler);
    this.#newEventComponent.setChangeEventTypeHandler(this.#changeEventTypeFunc);

    if (prevNewEventComponent === null) {
      render(this.#newEventComponent, this.#newEventContainer.element, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#newEventComponent, prevNewEventComponent);
    remove(prevNewEventComponent);

    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  destroy() {
    if (this.#newEventComponent === null) {
      return;
    }

    this.#destroyCallback();

    remove(this.#newEventComponent);
    this.#newEventComponent = null;

    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  #addNewEventHandler = (event) => {
    this.#changeDataFunc(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      {...event, id: nanoid()},
    );
    this.destroy();
  };

  #closeEditFormHandler = () => {
    this.destroy();
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

}
