import { createStore, combineReducers, applyMiddleware } from 'redux';
import appReducer from './reducers/appReducer';
import appMiddleware from './middlewares/appMiddleware';

const allReducers = combineReducers(appReducer);
const store = createStore(
  allReducers,
  // applyMiddleware() tells createStore() how to handle middleware
  applyMiddleware(appMiddleware)
)
export default store;