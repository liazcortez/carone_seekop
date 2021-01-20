import { GET_COMMENTS_BY_LEAD, CREATE_COMMENT, SET_ERROR, GET_COMMENTS_BY_OMSGLOBAL, CLEAR_STATE, GET_COMMENTS_BY_QUESTLEAD } from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_COMMENTS_BY_LEAD:
      return {
        ...state,
        comments: action.payload,
        loading: false,
        error: null

      };
    case GET_COMMENTS_BY_QUESTLEAD:
      return {
        ...state, 
        comments: action.payload,
        loading: false,
        error: null
      }
    case GET_COMMENTS_BY_OMSGLOBAL:
      return {
        ...state,
        comments: action.payload,
        loading: false,
        error: null

      };
    case CREATE_COMMENT:
      return {
        ...state,
        loading: false
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case CLEAR_STATE:
      return {
        ...state,
        comments: [],
        comment: {},
        error: null,
        loading: false
      }
    default:
      return state;
  }
};
