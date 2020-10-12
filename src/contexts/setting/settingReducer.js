import { 
  GET_SETTINGS, 
  CREATE_SETTING, 
  GET_SETTING, 
  DELETE_SETTING, 
  UPDATE_SETTING, 
  SET_ERROR,
  GET_SETTINGS_BY_STORE,
  CLEAR_STATE,
  SET_LOADING
 } from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_SETTINGS_BY_STORE: 
      return {
        ...state,
        settings: action.payload,
        loading: false,
        error: null
      }
    case GET_SETTINGS:
      return {
        ...state,
        settings: action.payload,
        loading: false,
        error: null

      };
    case GET_SETTING:
      return {
        ...state,
        setting: action.payload,
        loading: false,
        error: null

      };
    case CREATE_SETTING:
      return {
        ...state,
        settings: [action.payload, ...state.settings],
        loading: false,
        error: null

      };
    case DELETE_SETTING:
      return {
        ...state,
        setting: null,
        loading: false,
        error: null

      }
    case UPDATE_SETTING:
      return {
        ...state,
        setting: action.payload,
        loading: false,
        error: null

      }
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
        
      }
    case CLEAR_STATE:
      return {
        setting: {},
        settings: [],
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
