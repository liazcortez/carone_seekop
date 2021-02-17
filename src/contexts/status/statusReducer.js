import { 
  GET_STATUSES, 
  GET_STATUS, 
  CREATE_STATUS, 
  DELETE_STATUS, 
  UPDATE_STATUS, 
  SET_ERROR,
  CLEAR_STATE,
  SET_LOADING
 } from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_STATUSES:
      return {
        ...state,
        statuses: action.payload,
        loading: false,
        error: null
      };
    case GET_STATUS:
      return {
        ...state,
        status: action.payload,
        loading: false,
        error: null
      };
    case CREATE_STATUS:
      return {
        ...state,
        loading: false,
        error: null
      };
    case DELETE_STATUS:
      state.statuses = state.statuses.filter( item => item._id.toString() !== action.payload.toString())
      return {
        ...state,
        status: null,
        loading: false,
        error: null
      };
    case UPDATE_STATUS:
        return {
          ...state,
          status: action.payload,
          loading: false,
          error: null
        };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case CLEAR_STATE:
      return {
        loading: false,
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
