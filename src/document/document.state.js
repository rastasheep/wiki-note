import { ReplaySubject, pipe } from 'rxjs';
import { scan, map, distinctUntilChanged, shareReplay, tap } from 'rxjs/operators';
import { get, isEqual } from 'lodash-es';

export class Action {
  constructor(type, payload) {
    this.type = type;
    this.payload = payload;
  }
}

export class DocumentState {
  constructor() {
    this.actions = new ReplaySubject();
    this.state = this.actions.pipe(
      tap(console.log), // TODO: remove me, debug purposes
      reducer(),
      shareReplay(1),
    );
  }

  select(path) {
    return this.state.pipe(select(path));
  }

  dispatch(action) {
    this.actions.next(action);
  }

  register(modules) {
    modules.forEach(module => new module(this));
  }
}

const reducer = () =>
  scan((state, action) => {
    let next;
    switch (action.type) {
      case 'DOCUMENT_SELECTED':
        next = { ...action.payload };
        break;
      case 'DOCUMENT_LOADED':
      case 'DOCUMENT_UPDATED':
        next = { ...state, ...action.payload };
        break;
      default:
        next = state;
        break;
    }

    return next;
  }, {});

const select = path =>
  pipe(
    map(state => get(state, path, null)),
    distinctUntilChanged(isEqual),
  );
