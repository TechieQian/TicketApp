import { createStore, combineReducers, applyMiddleware } from "redux";
import logger from "redux-logger";
import orderReducer from './orderReducer'

const reducer = combineReducers({ orders : orderReducer}) // No need to combine, but in case more states come...
const store = createStore(reducer, applyMiddleware(logger));
export default store;
export * from './orderReducer'