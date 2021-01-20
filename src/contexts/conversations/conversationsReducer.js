import {
  CLEAR_STATE,
  SET_ERROR,
  CLEAR_ERROR
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case CLEAR_ERROR:
      return {
        ...state,
        error: null
      }
    case CLEAR_STATE:
      return {
        currentConversation: {},
        conversations: [],
        messages: [],
        loading: false,
        error: null
      }
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loadig: false
      }

    default:
      return state;
  }
};
