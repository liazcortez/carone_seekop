import { 
  GET_LISTS,
  GET_LIST,
  SET_LOADING,
  CLEAR_STATE,
  UPDATE_LIST,
  DELETE_LIST,
  GET_CONTACTS_BY_LIST
 } from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_CONTACTS_BY_LIST:
      return {
        ...state,
        contacts: action.payload,
        loading: false,
        error: null
      }
    case GET_LISTS:
      return {
        ...state,
        lists: action.payload,
        loading: false, 
        error: null
      }; 
    case GET_LIST:
      return {
        ...state,
        list: action.payload,
        loading: false, 
        error: null
      }; 
    case DELETE_LIST:
      return {
        ...state,
        list: null,
        loading: false,
        error: null
      };
    case SET_LOADING:
      return {
        ...state,
        loading: true, 
        error: null
      };
    case UPDATE_LIST:
      return {
        ...state,
        loading: true,
        list: action.payload,
        error: null
      }
    case CLEAR_STATE:
      return {
        list: {},
        lists: [],
        loading: false,
        error: null
      } 
    
    default:
      return state;
  }
};
