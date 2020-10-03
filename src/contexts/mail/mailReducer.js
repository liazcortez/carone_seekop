import { 
  GET_MAILS, 
  CREATE_MAIL, 
  GET_MAIL, 
  DELETE_MAIL, 
  UPDATE_MAIL, 
  SET_ERROR,
  CLEAR_STATE,
  SET_LOADING,
  GET_MAILS_BY_LEAD
 } from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_MAILS_BY_LEAD:
      return {
        ...state,
        mails: action.payload,
        loading: false, 
        error: null
      }; 
    case GET_MAILS:
      return {
        ...state,
        mails: action.payload,
        loading: false, 
        error: null
      };
    case GET_MAIL:
      return {
        ...state,
        mail: action.payload,
        loading: false, 
        error: null
      };
    case CREATE_MAIL:
      return {
        ...state,
        mails: [action.payload, ...state.mails],
        loading: false, 
        error: null
      };
    case DELETE_MAIL:
      return {
        ...state,
        mail: null,
        loading: false, 
        error: null
      };
    case UPDATE_MAIL:
      return {
        ...state,
        mail: action.payload,
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
        mail: {},
        mails: [],
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
