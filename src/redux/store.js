import { createStore, combineReducers, applyMiddleware } from 'redux';
import gameReducer from './reducers/gameReducer';
import appMiddleware from './middlewares/appMiddleware';

const allReducers = combineReducers({game: gameReducer});
const store = createStore(
  allReducers,
  // applyMiddleware() tells createStore() how to handle middleware
  applyMiddleware(appMiddleware)
)
export default store;