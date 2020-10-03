import { 
  GET_SOCIAL_ACCOUNTS, 
  CREATE_SOCIAL_ACCOUNT, 
  GET_SOCIAL_ACCOUNT, 
  DELETE_SOCIAL_ACCOUNT, 
  UPDATE_SOCIAL_ACCOUNT, 
  SET_ERROR,
  CLEAR_STATE,
  SET_LOADING
 } from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_SOCIAL_ACCOUNTS:
      return {
        ...state,
        socialAccounts: action.payload,
        loading: false
      };
    case GET_SOCIAL_ACCOUNT:
      return {
        ...state,
        socialAccount: action.payload,
        loading: false
      };
    case CREATE_SOCIAL_ACCOUNT:
      return {
        ...state,
        socialAccounts: [action.payload, ...state.socialAccounts],
        loading: false
      };
    case DELETE_SOCIAL_ACCOUNT:
      return {
        ...state,
        socialAccount: null,
        loading: false
      }
    case UPDATE_SOCIAL_ACCOUNT:
      return {
        ...state,
        socialAccount: action.payload,
        loading: false
      }
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case CLEAR_STATE:
      return {
        socialAccount: {},
        socialAccounts: [],
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
