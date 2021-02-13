import { 
  GET_USERS, 
  GET_USER, 
  UPDATE_USER, 
  DELETE_USER, 
  CREATE_USER, 
  SET_ERROR,
  SET_LOADING,
  CLEAR_STATE,
  GET_USERS_BY_STORE
 } from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_USERS_BY_STORE:
      return {
        ...state,
        users: action.payload,
        loading: false,
        error: null
      };
    case GET_USERS:
      return {
        ...state,
        users: action.payload,
        loading: false,
        error: null
      };

    case GET_USER:
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null
      };
    case UPDATE_USER:
      return {
        ...state,
        loading: false,
        error: null
      };
    
    case DELETE_USER:
      state.users = state.users.filter( item => item._id.toString() !== action.payload.toString())
      return {
        ...state,
        user: null,
        loading: false,
        error: null
      };
    case CREATE_USER:
      return {
        ...state,
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
        user: {},
        users: [],
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
