import { 
  LOAD_CSV,
  CALL_USER,
  SET_LOADING
 } from '../types';

export default (state, action) => {
  switch (action.type) {
    case LOAD_CSV:
      return {
        ...state,
        loading: false,
        error: null
      }
      case CALL_USER:
      return {
        ...state,
        loading: false,
        callToken: action.payload,
        error: null
      }
      case SET_LOADING:
      return {
        ...state,
        loading: true
        }
      default:
        return state;
  }
};
