import { createStore, combineReducers, applyMiddleware } from 'redux';
import gameReducer from './reducers/gameReducer';
import appReducer from './reducers/appReducer';
import appMiddleware from './middlewares/appMiddleware';

const allReducers = combineReducers({game: gameReducer, app: appReducer});
const store = createStore(
  allReducers,
  // applyMiddleware() tells createStore() how to handle middleware
  applyMiddleware(appMiddleware)
)
export default store;